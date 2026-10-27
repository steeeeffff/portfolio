<?php
ini_set('display_errors', '0');
const DESTINATARIO = 'stefanianardellaweb@gmail.com'; 

function pulisci(string $v): string {
    // toglie a capo
    return trim(str_replace(["\r", "\n"], ' ', $v));
}

function torna(string $esito): void {
    header('Location: ../index.html?status=' . $esito . '#contatti');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    torna('error');
}

// trappola anti-bot: se è piena, fingiamo che sia andato tutto bene
if (!empty($_POST['sito'])) {
    torna('ok');
}

$nome      = pulisci($_POST['nome'] ?? '');
$email     = pulisci($_POST['email'] ?? '');
$oggetto   = $_POST['oggetto'] ?? '';
$messaggio = trim($_POST['messaggio'] ?? '');


$ammessi = ['Collaborazione', 'Altro'];
if (!in_array($oggetto, $ammessi, true)) {
    $oggetto = 'Contatto dal portfolio';
}

// controlli veri (quelli del browser non bastano)
if ($nome === '' || strlen($nome) > 80
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || $messaggio === '' || strlen($messaggio) > 2000) {
    torna('invalid');
}

$subject = 'Portfolio: ' . $oggetto;
$body    = "Nome: $nome\nEmail: $email\n\n$messaggio";

$headers = [
    'From'         => 'Portfolio <no-reply@stefanian.altervista.org>',  // un indirizzo del TUO dominio
    'Reply-To'     => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
];

$inviata = mail(DESTINATARIO, $subject, $body, $headers);
//$inviata = file_put_contents(__DIR__ . '/test.txt', $body . "\n---\n", FILE_APPEND) !== false;

torna($inviata ? 'ok' : 'error');