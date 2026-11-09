#!/usr/bin/env perl
use strict;
use warnings;
use IO::Socket::INET;
use FindBin qw($Bin);

# Solo moduli standard Perl. Servizio statico per prove su una rete fidata.
my $host = shift // '127.0.0.1';
my $port = shift // 8000;
die "Uso: perl serve.pl [indirizzo-bind] [porta]\n"
    if @ARGV || $port !~ /\A[0-9]+\z/ || $port < 1 || $port > 65535;
my $server = IO::Socket::INET->new(
    LocalAddr => $host, LocalPort => $port, Listen => 10,
    ReuseAddr => 1, Proto => 'tcp',
) or die "Impossibile ascoltare su $host:$port: $!\n";
$| = 1;
print "MaxiP: http://$host:$port/ — Ctrl+C per terminare\n";
print "Per la TV usa l'IP LAN del computer, non 0.0.0.0.\n" if $host eq '0.0.0.0';
$SIG{PIPE} = 'IGNORE';
my %files = (
    '/' => ['index.html', 'text/html; charset=utf-8'],
    '/index.html' => ['index.html', 'text/html; charset=utf-8'],
    '/style.css' => ['style.css', 'text/css; charset=utf-8'],
    '/game.js' => ['game.js', 'application/javascript; charset=utf-8'],
    '/app.js' => ['app.js', 'application/javascript; charset=utf-8'],
);

while (my $client = $server->accept()) {
    eval {
        local $SIG{ALRM} = sub { die "Timeout richiesta\n" };
        alarm 5;
        my $request = <$client> // '';
        my ($method, $path) = $request =~ /\A(GET|HEAD) (\/\S*) HTTP\/1\.[01]\r?\n\z/;
        my $size = length $request;
        while (my $line = <$client>) {
            $size += length $line;
            die "Richiesta troppo grande\n" if $size > 16384;
            last if $line =~ /\A\r?\n\z/;
        }
        $path =~ s/\?.*\z// if defined $path;
        my ($status, $body, $type) = ('404 Not Found', "Non trovato\n", 'text/plain; charset=utf-8');
        if (!defined $method) {
            ($status, $body) = ('400 Bad Request', "Richiesta non supportata\n");
        } elsif (exists $files{$path}) {
            my ($name, $mime) = @{$files{$path}};
            if (open my $file, '<:raw', "$Bin/$name") {
                local $/;
                $body = <$file>;
                close $file;
                ($status, $type) = ('200 OK', $mime);
            } else {
                ($status, $body) = ('500 Internal Server Error', "File non disponibile\n");
            }
        }
        print {$client} "HTTP/1.1 $status\r\nContent-Type: $type\r\n",
            'Content-Length: ', length($body), "\r\nConnection: close\r\n",
            "Cache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\n\r\n";
        print {$client} $body unless defined $method && $method eq 'HEAD';
    };
    alarm 0;
    close $client;
}
