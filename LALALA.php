public function encrypt() {
		$encryption_key = "12345678901234567890123456789012";
		$iv = "1234567890ABCDEF";
		$encrypted = openssl_encrypt('WHO_LET_THE_DOGS_OUT', 'aes-256-cbc', $encryption_key, 0, $iv);
		echo $encrypted;

		$decrypted = openssl_decrypt($encrypted, 'aes-256-cbc', $encryption_key, 0, $iv);
		echo $decrypted;
	}