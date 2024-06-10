
import  { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Authors() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const newUser = {
        name,
        username,
        email
      };
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
      setUsers([...users, response.data]);
      setName('');
      setUsername('');
      setEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (id) => {
    setEditMode(true);
    const userToEdit = users.find(user => user.id === id);
    setEditingUser(userToEdit);
    setName(userToEdit.name);
    setUsername(userToEdit.username);
    setEmail(userToEdit.email);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = {
        ...editingUser,
        name,
        username,
        email
      };
      await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, updatedUser);
      const updatedUsers = users.map(user =>
        user.id === editingUser.id ? { ...user, name, username, email } : user
      );
      setUsers(updatedUsers);
      setEditMode(false);
      setEditingUser(null);
      setName('');
      setUsername('');
      setEmail('');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      <div className="form">
        <label htmlFor='name'>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor='name'>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor='name'>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        {editMode ? (
          <button onClick={handleUpdateUser}>Update User</button>
        ) : (
          <button onClick={handleAddUser}>Add User</button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEditUser(user.id)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Authors;