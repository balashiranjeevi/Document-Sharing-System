const axios = require("axios");

// Configure axios for CSRF protection
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || "TempPass123!";

async function createUser(name, email, password = DEFAULT_PASSWORD) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      withCredentials: true
    });
    console.log(`Created user: ${name} - ${email}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to create user ${name}:`,
      error.response?.data || error.message
    );
  }
}

async function create30Users() {
  const names = [
    "John Smith", "Jane Doe", "Mike Johnson", "Sarah Wilson", "David Brown",
    "Lisa Davis", "Chris Miller", "Emma Garcia", "Ryan Martinez", "Amy Rodriguez",
    "Kevin Lee", "Jessica Taylor", "Brian Anderson", "Ashley Thomas", "Daniel Jackson",
    "Michelle White", "Steven Harris", "Nicole Martin", "Matthew Thompson", "Jennifer Garcia",
    "Andrew Clark", "Amanda Lewis", "Joshua Robinson", "Stephanie Walker", "Justin Hall",
    "Rachel Allen", "Brandon Young", "Melissa King", "Tyler Wright", "Lauren Lopez",
    "Jacob Hill", "Samantha Green", "Nathan Adams", "Victoria Baker", "Alexander Nelson"
  ];
  
  const users = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const email = `${name.toLowerCase().replace(' ', '.')}${i + 1}@company.com`;
    users.push(createUser(name, email));
    
    // Add delay to avoid overwhelming the server
    if (i % 5 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  await Promise.all(users);
  console.log(`Finished creating ${names.length} users.`);
}

create30Users();
