document.getElementById('sign-in-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // Burada giriş işlemi için yapılacak işlemler
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Giriş yapma isteği gönderme (API entegrasyonu vs.)
  console.log(`Giriş yapıldı: ${email}, ${password}`);
});
