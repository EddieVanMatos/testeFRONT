const apiUrl = 'http://localhost:8080/api/courses';

// Função para buscar e exibir todos os cursos
async function getCourses() {
    const response = await fetch(apiUrl);
    const courses = await response.json();
    
    displayCourses(courses);
}

// Função para exibir cursos na lista
function displayCourses(courses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; // Limpa a lista

    courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.id}: ${course.nome} - ${course.descricao}`;
        courseList.appendChild(li);
    });
}

// Função para buscar curso por ID ou nome
async function searchCourse(query) {
    if (!query) {
        // Se a busca estiver vazia, exibe todos os cursos
        getCourses();
        return;
    }

    // Tenta buscar por ID primeiro
    let response = await fetch(`${apiUrl}/${query}`);
    if (response.status === 404) {
        // Se não encontrar por ID, tenta buscar por nome
        response = await fetch(apiUrl);
        const courses = await response.json();
        const filteredCourses = courses.filter(course =>
            course.nome.toLowerCase().includes(query.toLowerCase())
        );
        displayCourses(filteredCourses);
    } else {
        const course = await response.json();
        displayCourses([course]);
    }
}

// Função para adicionar um novo curso
async function addCourse(event) {
    event.preventDefault();  // Impede o recarregamento da página

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const newCourse = {
        nome: name,
        descricao: description
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
    });

    // Atualiza a lista de cursos
    getCourses();
}

// Event listener para o formulário de adição de curso
document.getElementById('course-form').addEventListener('submit', addCourse);

// Event listener para o botão de busca
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    searchCourse(query);
});

// Carrega os cursos ao iniciar
getCourses();
