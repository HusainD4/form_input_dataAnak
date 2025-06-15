downloadBtn.addEventListener("click", async () => {
  if(dataList.length === 0){
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

  // Mulai pakai ExcelJS
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

  // Download file Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "Data_Anak_3-6_Tahun.xlsx";
    link.click();
  });
});
