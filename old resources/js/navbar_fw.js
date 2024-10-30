function loadNavbar() {
    axios.get('resources/navbar_fw.html')
        .then(response => {
            document.getElementById('navbar').innerHTML = response.data;
        })
        .catch(error => console.error('Error loading navbar:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});