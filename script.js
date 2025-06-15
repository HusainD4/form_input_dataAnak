// Utility fungsi kapitalisasi setiap kata
function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");
  const tableBody = document.querySelector("#dataTable tbody");
  const downloadBtn = document.getElementById("downloadExcel");

  // Ambil data dari localStorage dengan kunci "anakData"
  let dataList = JSON.parse(localStorage.getItem("anakData")) || [];

  // Render tabel data anak
  function renderTable() {
    tableBody.innerHTML = "";

    if (dataList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">Belum ada data</td></tr>`;
      return;
    }

    dataList.forEach((data, index) => {
      const row = `<tr>
        <td>${index + 1}</td>
        <td>${data.nama}</td>
        <td>${data.tempat}</td>
        <td>${data.tgl_lahir}</td>
        <td>${data.nik}</td>
        <td>${data.sekolah}</td>
        <td>${data.ortu}</td>
        <td>${data.hp}</td>
        <td>${data.rw}</td>
        <td>${data.rt}</td>
      </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  renderTable();

  // Simpan data dari form ke localStorage dan update tabel
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = {
        nama: capitalizeWords(document.getElementById("nama").value.trim()),
        tempat: capitalizeWords(document.getElementById("tempat").value.trim()),
        tgl_lahir: document.getElementById("tgl_lahir").value,
        nik: document.getElementById("nik").value.trim(),
        sekolah: capitalizeWords(document.getElementById("sekolah").value.trim()),
        ortu: capitalizeWords(document.getElementById("ortu").value.trim()),
        hp: document.getElementById("hp").value.trim(),
        rw: document.getElementById("rw").value.trim(),
        rt: document.getElementById("rt").value.trim(),
      };

      dataList.push(data);
      localStorage.setItem("anakData", JSON.stringify(dataList));

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil disimpan!'
      });

      form.reset();
      renderTable();
    });
  }

  // Export data ke Excel pakai ExcelJS dengan styling
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      if (dataList.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Data kosong",
          text: "Tidak ada data untuk diunduh."
        });
        return;
      }

      const { value: kelurahan } = await Swal.fire({
        title: 'Input Nama Kelurahan',
        input: 'text',
        inputLabel: 'Nama Kelurahan',
        inputPlaceholder: 'Contoh: Kelurahan Sukamaju',
        showCancelButton: true,
      });

      if (!kelurahan) return;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Anak');

      // Judul & Kelurahan
      worksheet.mergeCells('A1:J1');
      worksheet.getCell('A1').value = "DATA ANAK USIA 3-6 TAHUN";
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').font = { bold: true, size: 14 };

      worksheet.mergeCells('A2:J2');
      worksheet.getCell('A2').value = `KELURAHAN ${kelurahan.toUpperCase()}`;
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A2').font = { bold: true, size: 12 };

      // Header
      const headerRow = worksheet.addRow([
        "No", "Nama Anak", "Tempat Lahir", "Tanggal Lahir", "NIK", "Nama Sekolah",
        "Nama Orang Tua", "Nomor HP", "RW", "RT"
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{ argb:'D9EAF7' }
      };
      headerRow.eachCell((cell) => {
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });

      // Data rows
      dataList.forEach((d, i) => {
        const row = worksheet.addRow([
          i+1, d.nama, d.tempat, d.tgl_lahir, d.nik, d.sekolah,
          d.ortu, d.hp, d.rw, d.rt
        ]);
        row.eachCell((cell) => {
          cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
        });
      });

      // Set column widths agar rapi
      worksheet.columns = [
        { width: 5 },
        { width: 20 },
        { width: 18 },
        { width: 15 },
        { width: 20 },
        { width: 25 },
        { width: 25 },
        { width: 18 },
        { width: 5 },
        { width: 5 },
      ];

      // Generate file dan download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "Data_Anak_3-6_Tahun.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

    });
  }
});
