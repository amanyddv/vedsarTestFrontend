import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/info')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users', error);
      });
  }, [users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    axios.post('http://localhost:5000/userData', formData)
      .then((response) => {
        setUsers([...users, response.data]);
        setName('');
        setImage(null);
      })
      .catch((error) => {
        console.error('Error adding user data', error);
      });
  };

  const deleteUser = (id) => {
    axios.post('http://localhost:5000/deleteUser', { id })
      .then((response) => {
        setUsers(users.filter(user => user._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting user data', error);
      });
  };

  const handleEdit = (data) => {
    setEditingUser(data);
    setEditName(data.name);
    setEditImage(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', editName);
    formData.append('id',editingUser._id)
    if (editImage) {
      formData.append('image', editImage);
    }

    axios.post(`http://localhost:5000/updateUser/`, formData)
      .then((response) => {
        setUsers(users.map(user => user._id === editingUser._id ? response.data : user));
        setEditingUser(null);
        setEditName('');
        setEditImage(null);
      })
      .catch((error) => {
        console.error('Error updating user data', error);
      });
  };

  return (
    <div>
      <h1>User List</h1>
      {!editingUser &&
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Data"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Add Data</button>
      </form>
    }

      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Edit Data"
              required
            />
            <input
              type="file"
              onChange={(e) => setEditImage(e.target.files[0])}
            />
            <button type="submit">Update Data</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}

      <ul>
        {users.map((data) => (
          <li key={data._id}>
            <span>{data.name}</span>
            {data.imageUrl && <img src={`http://localhost:5000${data.imageUrl}`} alt="Data" width="100" />}
            <button onClick={() => deleteUser(data._id)}>Delete</button>
            <button onClick={() => handleEdit(data)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
