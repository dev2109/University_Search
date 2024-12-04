const apiUrl = 'http://universities.hipolabs.com/search';

document.getElementById('countryInput').addEventListener('input', async function () {
    const country = this.value.trim();
    if (country.length < 2) return;

    const response = await fetch(`${apiUrl}?country=${country}`);
    const universities = await response.json();

    populateStates(universities);
    displayUniversities(universities);
});

function populateStates(universities) {
    const stateDropdown = document.getElementById('stateDropdown');
    const states = [...new Set(universities.map(u => u['state-province']).filter(Boolean))];

    stateDropdown.innerHTML = '<option value="">State/Province</option>';
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateDropdown.appendChild(option);
    });

    stateDropdown.disabled = states.length === 0;
    stateDropdown.addEventListener('change', () => {
        const selectedState = stateDropdown.value;
        const filteredUniversities = universities.filter(u => u['state-province'] === selectedState);
        displayUniversities(selectedState ? filteredUniversities : universities);
    });
}

function displayUniversities(universities) {
    const universityCards = document.getElementById('universityCards');
    universityCards.innerHTML = '';

    universities.forEach(university => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-name', university.name);

        card.innerHTML = `
      <div class="card-header">
        <h3>${university.name}</h3>
      </div>
      <div class="partition"></div>
      <div class="card-body">
        <a href="${university.web_pages[0]}" target="_blank">Visit Website</a>
        <button onclick="downloadUniversityImage('${university.name}', '${university.web_pages[0]}')">Download</button>
      </div>
    `;

        universityCards.appendChild(card);
    });
}


function downloadUniversityImage(name, website) {
    const card = document.querySelector(`[data-name="${name}"]`);
    if (!card) return;
    const canvas = document.createElement('canvas');
    const canv = canvas.getContext('2d');
    const cardWidth = 350;
    const cardHeight = 350;
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    canv.fillStyle = "#fff";
    canv.fillRect(0, 0, cardWidth, cardHeight);
    canv.font = "24px Arial";
    canv.fillStyle = "#333";
    canv.fillText(name, 10, 30);
    canv.font = "18px Arial";
    canv.fillStyle = "#000";
    canv.fillText(`Website: ${website}`, 10, 60);
    const imageUrl = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name.replace(/\s+/g, '_')}_info.jpg`;


    link.click();
}
