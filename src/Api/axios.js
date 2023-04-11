import axios from "axios";

export default axios.create({
    baseURL: 'http://localhost:81/react-app/database.php',
  
    headers: {
        'content-type': 'application/json',
    }
})
  // baseURL: 'http://muoiti.com/update.php/',