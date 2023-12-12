import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/Provider.jsx";

export default function Users ()
{
    const [users,setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()
    const  onDelete = (u) => {
        if (!window.confirm("Are you sure you want to delete ?")){
            return
        }
        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                setNotification("User is deleted")
                getUsers()
            })
    }

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
            .then(({data}) =>{
                setLoading(false)
                console.log(data)
                setUsers(data.data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div>
            <div style={{display:'flex', justifyContent: 'space-between', alignItems:'center'}}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add new user</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>CRATE DATE</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    { loading && <tbody>
                    <tr>
                        <td colSpan="5" className="text-center">Just a mom....</td>
                    </tr>
                    </tbody>
                    }
                    { !loading  && <tbody>
                    {users.map(u => (
                        <tr>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.created_at}</td>
                            <td>
                                <Link to={'/users/'+u.id} className="btn-edit">Edit</Link>
                                &nbsp;
                                <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody> }
                </table>
            </div>
        </div>
    )
}
