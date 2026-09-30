<?php
header('Content-Type: application/json; charset=utf-8');

$to = 'stefania.nardella@gmail.com'; // destinatario

function reply(bool $ok, string $message): void
{
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(false, 'Metodo non consentito.');

// Honeypot anti-spam: i bot compilano il campo nascosto
if (!empty($_POST['website'])) reply(true, 'Messaggio inviato!');

$name    = trim(strip_tags($_POST['name'] ?? ''));
$subjectIn = trim(strip_tags($_POST['subject'] ?? ''));
$email   = trim($_POST['email'] ?? '');
$message = trim(strip_tags($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(false, 'Compila tutti i campi con un indirizzo email valido.');
}
if (preg_match('/[\r\n]/', $name . $email . $subjectIn)) reply(false, 'Dati non validi.'); // header injection

$subject = 'Portfolio: ' . ($subjectIn ?: 'Nuovo messaggio') . ' - ' . $name;
$body    = "Nome: $name\nEmail: $email\nOggetto: $subjectIn\n\nMessaggio:\n$message\n";
$headers = [
    'From'         => 'Portfolio <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>',
    'Reply-To'     => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
];

$sent = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

reply($sent, $sent ? 'Grazie! Messaggio inviato, ti rispondo presto.' : 'Invio non riuscito. Riprova più tardi.');
