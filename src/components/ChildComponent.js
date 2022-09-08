import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Table } from 'react-bootstrap';
import { egitim_query, okul_query, bolum_query, kodlar_query, delete_egitim_query } from '../services/Service';
import { InformationComponent } from './InformationComponent';
import { useMutation, useQuery } from "@apollo/client";

export const ChildComponent = ({ id, isChild, setChild }) => {

    const [egt, setEgt] = useState({
        id: null,
        okulId: null,
        bolumId: null,
        personelId: null,
        tur: '',
        diplomaNo: '',
        mezuniyet: ''
    });

    const [egitims, setEgitims] = useState([]);

    const [isButon, setButon] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const deleteControl = () => {
        deleteEgitim({ variables: { id: `${egt.id}` } })
    }

    const { loading: loading1, error: error1, data: egitimlerData } = useQuery(egitim_query, {variables: {id: id}});

    const { loading: loading2, error: error2, data: okullarData } = useQuery(okul_query);

    const { loading: loading3, error: error3, data: bolumlerData } = useQuery(bolum_query);

    const { loading: loading4, error: error4, data: kodlarTurData } = useQuery(kodlar_query, {variables: {tablo: 'OKULTUR'}});

    const [deleteEgitim] = useMutation(delete_egitim_query, { refetchQueries: [egitim_query] })

    useEffect(() => {
        if (loading1 === false && egitimlerData) {
            setEgitims(egitimlerData.allEgitim);
        }
    }, [egitimlerData])

    if (loading1 || loading2 || loading3 || loading4) {
        return <div>Loading...</div>
    }
    
    if (error1 || error2 || error3 || error4 ) {
        return <div>Error!</div>;
    }
    
    return (
        <>
            <Modal centered={true} size='lg' show={isChild}>
                <Modal.Header closeButton>
                    <Modal.Title>Eğitim Bilgileri</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Button size='sm' style={{ height: "35" }} onClick={() => setEgitims([...egitims, {id: null, okulId: null, bolumId: null, personelId: id, tur: '', diplomaNo: '', mezuniyet: ''}])}>Kayıt Ekle</Button>
                    <Button size='sm' style={{ height: "35", marginLeft: "10px" }} onClick={() => isButon ? deleteControl() : null}>Kayıt Sil</Button>
                    <Table style={{ marginBottom: '270px', marginLeft: '25px' }}>
                        <thead>
                            <tr>
                                <td>Okul Adı</td>
                                <td>Bölüm Adı</td>
                                <td>Okul Türü</td>
                                <td>Diploma No</td>
                                <td>Mezuniyet Tarihi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                egitims.map(egitim => (
                                    <tr key={egitim.id} onClick = {() => {setEgt(egitim); setButon(true);}}>
                                        <td>
                                            <Form.Select name={`okulId/${egitim.id}`} value={egitim.okulId} disabled={true}>
                                                <option value={''}></option>
                                                {okullarData.okul.map(okul => (
                                                    <option key={okul.id} value={okul.id}>{okul.ad}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Select name={`bolumId/${egitim.id}`} value={egitim.bolumId} disabled={true}>
                                                <option value={''}></option>
                                                {bolumlerData.bolum.map(bolum => (
                                                    <option key={bolum.id} value={bolum.id}>{bolum.ad}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Select name={`tur/${egitim.id}`} value={egitim.tur} disabled={true}>
                                                <option value={''}></option>
                                                {kodlarTurData.kodlar.map(tablo => (
                                                    <option key={tablo.id} value={tablo.id}>{tablo.kodAck}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td> {egitim.diplomaNo} </td>
                                        <td> {egitim.mezuniyet} </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    {<Button variant="secondary" onClick={() => setChild(false)}>
                        Close
                    </Button>}
                    {isButon && <Button variant="primary" onClick={() => setOpen(true)}>
                        Information Entry
                    </Button>}
                </Modal.Footer>
                {isOpen ? <InformationComponent egt = {egt} setEgt = {setEgt} isOpen = {isOpen} setOpen = {setOpen} setButon = {setButon} isChild = {isChild} setChild = {setChild} /> : null}
            </Modal>
        </>
    );  
}