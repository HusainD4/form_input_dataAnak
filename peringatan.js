// ✅ Cek apakah sudah pernah dijalankan di tab ini
if (!sessionStorage.getItem("peringatanDitampilkan")) {
  // Tampilkan SweetAlert hanya sekali per tab
  window.addEventListener('DOMContentLoaded', () => {
    Swal.fire({
      title: 'Peringatan Penting!',
      text: 'Jangan tutup halaman ini sebelum menyimpan data Anda.',
      icon: 'warning',
      confirmButtonText: 'Saya Mengerti',
      confirmButtonColor: '#d33',
      background: '#fefefe',
      backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `
    });
  });

  // Set penanda bahwa peringatan sudah ditampilkan
  sessionStorage.setItem("peringatanDitampilkan", "true");
}

// ✅ Variabel untuk deteksi refresh atau klik link
let isNavigatingAway = false;

// Deteksi tombol refresh (F5 / Ctrl+R)
window.addEventListener("keydown", function (e) {
  if ((e.key === "F5") || (e.ctrlKey && e.key.toLowerCase() === "r")) {
    isNavigatingAway = true;
  }
});

// Deteksi klik link
document.addEventListener("click", function (e) {
  const target = e.target.closest('a');
  if (target) {
    isNavigatingAway = true;
  }
});

// ✅ Tampilkan native browser confirm hanya saat close tab
window.addEventListener("beforeunload", function (e) {
  if (!isNavigatingAway) {
    e.preventDefault();
    e.returnValue = ''; // Munculkan konfirmasi bawaan browser
  }
});
