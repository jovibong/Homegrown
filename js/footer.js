function loadFooter() {
    axios.get('resources/footer.html')
        .then(response => {
            document.getElementsByTagName('footer')[0].innerHTML = response.data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadFooter();
});