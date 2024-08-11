document.getElementById('create-account-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // Burada hesap oluşturma işlemi için yapılacak işlemler
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Hesap oluşturma isteği gönderme (API entegrasyonu vs.)
  console.log(`Hesap oluşturuldu: ${name}, ${email}, ${password}`);
});
