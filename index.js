document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processData(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function processData(data) {
    const headers = data[0];
    const rows = data.slice(1);
    const productMap = new Map();

    rows.forEach(row => {
        const [codigo, nome, valor, quantidade] = row;  // Corrigindo a ordem dos campos
        if (productMap.has(codigo)) {
            const existingProduct = productMap.get(codigo);
            existingProduct.quantidade += quantidade;
        } else {
            productMap.set(codigo, { nome, codigo, quantidade, valor });
        }
    });

    const checklist = document.getElementById('checklist');
    checklist.innerHTML = ''; // Limpar qualquer dado anterior

    productMap.forEach(product => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `item-${product.codigo}`;
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                listItem.classList.add('checked');
            } else {
                listItem.classList.remove('checked');
            }
        });

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = `Nome: ${product.nome}, Código: ${product.codigo}, Quantidade: ${product.quantidade}, Valor: ${product.valor}`;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        checklist.appendChild(listItem);
    });

    document.getElementById('checklist-section').style.display = 'block';
}
