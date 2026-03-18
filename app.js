let excelData = [];

// قراءة الملف (مدعوم لكل الصيغ)
document.getElementById("fileInput").addEventListener("change", function(e) {

    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();

    let bar = document.getElementById("bar");
    let percent = document.getElementById("percent");

    bar.style.width = "0%";
    percent.innerText = "0%";

    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            let p = Math.floor((e.loaded / e.total) * 100);
            bar.style.width = p + "%";
            percent.innerText = p + "%";
        }
    };

    reader.onload = function(e) {
        try {

            let data = new Uint8Array(e.target.result);

            let workbook = XLSX.read(data, {
                type: "array"
            });

            let allRows = [];

            // 🔥 قراءة كل الشيتات (مو واحد فقط)
            workbook.SheetNames.forEach(name => {
                let sheet = workbook.Sheets[name];

                let rows = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    defval: ""
                });

                allRows = allRows.concat(rows);
            });

            excelData = allRows;

            alert("تم تحميل الملف بالكامل ✔ (" + excelData.length + " صف)");

            percent.innerText = "✔ جاهز";

        } catch (err) {
            alert("❌ خطأ في قراءة الملف (قد يكون كبير جداً أو غير مدعوم)");
            console.error(err);
        }
    };

    reader.readAsArrayBuffer(file);
});

// 🔥 بحث في كل الملف (كل الأعمدة)
function search() {

    let query = document.getElementById("searchInput").value.trim();

    if (!query) {
        alert("اكتب الاسم");
        return;
    }

    if (excelData.length === 0) {
        alert("حمّل ملف أولاً");
        return;
    }

    let resultsDiv = document.getElementById("results");
    let last = document.getElementById("lastResult");

    resultsDiv.innerHTML = "";
    last.value = "";

    let count = 0;

    for (let i = 0; i < excelData.length; i++) {

        let row = excelData[i];
        if (!row) continue;

        let rowText = row.join(" ");

        // 🔥 البحث في كل السطر (كل الأعمدة)
        if (rowText.includes(query)) {

            count++;

            let div = document.createElement("div");
            div.className = "result";
            div.textContent = rowText;

            resultsDiv.appendChild(div);

            last.value = rowText;
        }
    }

    if (count === 0) {
        resultsDiv.innerHTML = "❌ لا توجد نتائج";
    }
}

// نسخ
function copy() {
    let t = document.getElementById("lastResult");

    if (!t.value) return;

    t.select();
    document.execCommand("copy");

    alert("تم النسخ ✔");
}