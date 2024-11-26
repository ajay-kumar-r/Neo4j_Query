document.getElementById('submit-query').addEventListener('click', async () => {
    const queryType = document.getElementById('query-type').value;
    const name = document.getElementById('name').value;
    const movie = document.getElementById('movie').value;
    let query = '';
    let params = {};
  
    switch (queryType) {
      case 'find_user':
        query = 'MATCH (u:User {name: $name}) RETURN u';
        params = { name };
        break;
      case 'find_user_reviews':
        query = 'MATCH (u:User {name: $name})-[w:WATCHED]->(m:Movie) RETURN u.name AS User, m.title AS Movie, w.rating AS Rating';
        params = { name };
        break;
      case 'movie_genre':
        query = 'MATCH (m:Movie {title: $movie})-[r:HAS_GENRE]->(g:Genre) RETURN m.title AS Movie, g.name AS Genre;';
        params = { movie };
        break;
      case 'actors_list':
        query = `MATCH (a:Actor)-[:ACTED_IN]->(m:Movie {title: $movie})
                RETURN DISTINCT a.name AS Actor; `;
        params = { movie };
        break;
      default:
        alert('Invalid query type');
        return;
    }
  
    const response = await fetch('http://localhost:3000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });
  
    const data = await response.json();
    document.getElementById('results').textContent = JSON.stringify(data, null, 2);
  });
  