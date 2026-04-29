const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'alumni.json');

try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const alumni = JSON.parse(raw);
    const yearMap = {};

    alumni.forEach((item) => {
        let year;
        if (item.tanggalLulus && !isNaN(new Date(item.tanggalLulus).getFullYear())) {
            year = new Date(item.tanggalLulus).getFullYear();
        } else {
            year = (parseInt(item.tahunMasuk) || 2020) + 4;
        }
        yearMap[year] = (yearMap[year] || 0) + 1;
    });

    console.log('Total Records:', alumni.length);
    console.log('Yearly Statistics:');
    Object.keys(yearMap).sort().forEach(year => {
        console.log(`${year}: ${yearMap[year]}`);
    });
} catch (error) {
    console.error('Error:', error.message);
}
