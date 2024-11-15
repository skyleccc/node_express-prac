import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [storedToken, setStoredToken] = useState(null);
    const [notes, setNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [newNote, setNewNote] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('jwtoken');
        if (!token) navigate("/dashboard");
        else {
            setStoredToken(token);
            fetchNotes(token);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwtoken');
        navigate("/login");
    };

    const fetchNotes = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/notes', {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        };
    };

    const handleDelete = async (id, token) => {
        try {
            const response = await axios.delete(`http://localhost:3000/notes/${id}`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            if (response.status === 200) {
                // After deletion, update the notes state to exclude the deleted note
                setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            }
        } catch (error) {
            console.error("Error deleting note", error);
        }
    };

    const handleEdit = (note) => {
        setIsEditing(true);
        setCurrentNote(note);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedNote = {
            title: currentNote.title,
            description: currentNote.description,
        };
        try {
            const response = await axios.put(`http://localhost:3000/notes/${currentNote.id}`, updatedNote, {
                headers: {
                    'Authorization': `${storedToken}`,
                },
            });
            if (response.status === 200) {
                // After updating, update the notes state to reflect the changes
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note.id === currentNote.id ? { ...note, ...updatedNote } : note
                    )
                );
                setIsEditing(false);
                setCurrentNote(null);
            }
        } catch (error) {
            console.error("Error updating note", error);
        }
    };

    const handleAddNote = () => {
        setIsAdding(true);  // Show the "Add Note" form modal
    };

    const handleNewNoteChange = (e) => {
        const { name, value } = e.target;
        setNewNote(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddNoteSubmit = async (e) => {
        e.preventDefault();
        const { title, description } = newNote;
        if (!title || !description) {
            console.log('Both title and description are required');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/notes', newNote, {
                headers: {
                    'Authorization': `${storedToken}`,
                },
            });
            if (response.status === 201) {
                // After adding the new note, update the notes list
                setNotes(prevNotes => [...prevNotes, response.data]);
                setIsAdding(false); // Hide the modal
                setNewNote({ title: '', description: '' }); // Reset form
            }
        } catch (error) {
            console.error("Error adding note", error);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className='w-full h-24 bg-gradient-to-t from-gray-700 to-gray-800 flex items-center justify-between px-6'>
                <div className='flex items-center'>
                    <div className='text-white text-xl font-semibold mr-4'>Notes Dashboard</div>
                    <button
                        onClick={handleAddNote}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add Note
                    </button>
                </div>
                <div className='flex'>
                    <div className='items-center justify-between px-6 text-white'>
                        <div className='font-semibold text-lg'>
                            Token:
                        </div>
                        <div className='text-xs'>
                            {storedToken ? storedToken : 'No Token Found'}
                        </div>
                    </div>
                    <button onClick={handleLogout} className='text-white bg-red-500 hover:bg-red-600 px-4 py-auto rounded-lg transition-all'>Logout</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
                {notes.length === 0 ? (
                    <div className="text-white">No notes available</div>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-60 flex flex-col">
                            <div className='max-w-full bg-gray-500 text-center rounded-t-lg'>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{note.title}</h3>
                            </div>
                            <div className="text-gray-700 dark:text-gray-300 mt-2 py-2 px-5 flex-grow overflow-y-auto h-40">
                                <p className='break-words'>{note.description}</p>
                            </div>

                            <div className="flex justify-between px-5 py-2 mt-auto">
                                <button
                                    onClick={() => handleEdit(note)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id, storedToken)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isEditing && currentNote && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-3/4 md:w-1/2">
                        <h3 className="text-xl text-white font-semibold text-center mb-4">Edit Note</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={currentNote.title}
                                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    id="description"
                                    value={currentNote.description}
                                    onChange={(e) => setCurrentNote({ ...currentNote, description: e.target.value })}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-3/4 md:w-1/2">
                        <h3 className="text-xl text-white font-semibold text-center mb-4">Add New Note</h3>
                        <form onSubmit={handleAddNoteSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={newNote.title}
                                    onChange={handleNewNoteChange}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newNote.description}
                                    onChange={handleNewNoteChange}
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Add Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
