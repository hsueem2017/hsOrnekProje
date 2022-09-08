import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Button } from 'react-bootstrap';
import { personel_query, delete_personel_query } from '../services/Service';
import { SecondComponentt } from './SecondComponentt';
import { useQuery, useMutation } from "@apollo/client";

export const MainComponent = () => {

    const [id, setId] = useState(null);
    const [is, setIs] = useState();

    const [isUpdate, setUpdate] = useState(false);

    const navigate = useNavigate();

    const getId = (id) => {
        setId(id);
        if (id > 0) {
            setIs(true);
        } else {
            setIs(false);
        }
    }

    const deleteControl = (id) => {
        deletePersonel({ variables: { id: `${id}` } })
    }

    const signOut = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    const { loading, error, data } = useQuery(personel_query)

    const [deletePersonel] = useMutation(delete_personel_query, { refetchQueries: [personel_query] })

    if (loading) {
        return <div>Loading...</div>
    }
    
    if (error) {
        return <div>Error!</div>;
    }

    return (
        <div>
            <Button variant="outline-info" size='sm' style={{ position: 'absolute', right: '100px' }} onClick={signOut}>Sign Out</Button>
            <h2 style={{ margin: 30 }} className='text-center'>Personel Listesi</h2>
            <Table style={{ maxWidth: '60%', /*borderCollapse: 'separate', borderSpacing: '50px',*/ margin: 'auto' }}>
                <thead>
                    <tr>
                        <th> Ad </th>
                        <th> Soyad </th>
                        <th> Baba Adı </th>
                        <th> Ana Adı </th>
                        <th> Medeni Durumu </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.allPersonel.map(personel => (
                            <tr key={personel.id} >
                                <td style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => { getId(personel.id) }}> {personel.ad} </td>
                                <td> {personel.soyad} </td>
                                <td> {personel.babaAd} </td>
                                <td> {personel.anaAd} </td>
                                <td> {personel.medeniDurumNavigation === null ? "" : personel.medeniDurumNavigation.kodAck} </td>
                                <td>
                                    <Button className='btn btn-info' onClick={() => { getId(personel.id); setUpdate(true); }}>Update</Button>
                                    <Button className='btn btn-danger' onClick={() => deleteControl(personel.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            {<Button onClick={() => setIs(true) } style={{ position: 'absolute', bottom: '100px', right: '100px' }}>Kayıt Ekle</Button>}
            {is ? <SecondComponentt id={id} setId={setId} is={is} setIs={setIs} isUpdate={isUpdate} setUpdate={setUpdate} /> : null}
        </div>
    )
}