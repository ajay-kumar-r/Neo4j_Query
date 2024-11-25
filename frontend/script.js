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
      case 'find_friends':
        query = 'MATCH (u:User {name: $name})-[:FRIENDS_WITH]->(friend) RETURN friend';
        params = { name };
        break;
      case 'find_movie_lovers':
        query = 'MATCH (u:User)-[:LIKES]->(m:Movie {title: $movie}) RETURN u';
        params = { movie };
        break;
      case 'suggest_friends':
        query = `MATCH (u:User {name: $name})-[:FRIENDS_WITH]->(friend)-[:FRIENDS_WITH]->(suggestion)
                 WHERE NOT (u)-[:FRIENDS_WITH]->(suggestion) AND u <> suggestion
                 RETURN suggestion`;
        params = { name };
        break;
      default:
        alert('Invalid query type');
        return;
    }
  
    // Send the request to the backend
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
  