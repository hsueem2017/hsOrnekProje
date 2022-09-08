import React, { useState } from 'react';
import { Form, FormControl, Button, Modal, FormGroup, FormLabel } from 'react-bootstrap';
import { okul_query, bolum_query, kodlar_query, save_egitim_query, egitim_query, update_egitim_query } from '../services/Service';
import { useQuery, useMutation } from "@apollo/client";

export const InformationComponent = ({ egt, setEgt, isOpen, setOpen, setButon }) => {

    setButon(false);

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setEgt(
            { ...egt, [name]: value }
        )
    }

    const saveOrUpdate = () => {
        console.log(egt.id)
        if(egt.id === null) {
            createEgitim({
                variables: {
                    okulId: egt.okulId,
                    bolumId: egt.bolumId,
                    personelId: `${egt.personelId}`,
                    tur: egt.tur,
                    diplomaNo: egt.diplomaNo,
                    mezuniyet: egt.mezuniyet
                }
            })
        }else {
            updateEgitim({
                variables: {
                    patch:
                    {
                        id: `${egt.id}`,
                        okulId: `${egt.okulId}`,
                        bolumId: `${egt.bolumId}`,
                        personelId: `${egt.personelId}`,
                        tur: egt.tur,
                        diplomaNo: egt.diplomaNo,
                        mezuniyet: egt.mezuniyet
                    }
                }
            });
        }
        setOpen(false);
    }

    const [message, setMessage] = useState({
        message: "",
        isStatus: false
    })

    const { loading: loading1, error: error1, data: okullarData } = useQuery(okul_query);

    const { loading: loading2, error: error2, data: bolumlerData } = useQuery(bolum_query);

    const { loading: loading3, error: error3, data: kodlarTurData } = useQuery(kodlar_query, {variables: {tablo: 'OKULTUR'}});

    const [createEgitim] = useMutation(save_egitim_query, {refetchQueries: [egitim_query]})

    const [updateEgitim] = useMutation(update_egitim_query)

    if (loading1 || loading2 || loading3) {
        return <div>Loading...</div>
    }
    
    if (error1 || error2 || error3 ) {
        return <div>Error!</div>;
    }

    return (
        <>
            <Modal centered={true} size='lg' show={isOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Bilgi Girişi</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex" }}>
                    <Form style={{ paddingLeft: '50px' }}>
                        <FormGroup>
                            <FormLabel>Okul Adı</FormLabel>
                            <Form.Select name={'okulId'} value={egt.okulId} onChange={onChangeHandle}>
                                <option value={''}></option>
                                {okullarData.okul.map(okul => (
                                    <option key={okul.id} value={okul.id}>{okul.ad}</option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Bölüm Adı</FormLabel>
                            <Form.Select name={'bolumId'} value={egt.bolumId} onChange={onChangeHandle}>
                                <option value={''}></option>
                                {bolumlerData.bolum.map(bolum => (
                                    <option key={bolum.id} value={bolum.id}>{bolum.ad}</option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Okul Türü</FormLabel>
                            <Form.Select name={'tur'} value={egt.tur} onChange={onChangeHandle}>
                                <option value={''}></option>
                                {kodlarTurData.kodlar.map(tablo => (
                                    <option key={tablo.id} value={tablo.id}>{tablo.kodAck}</option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                        <Form.Group>
                            <Form.Label>Diploma No</Form.Label>
                            <FormControl type='text' name='diplomaNo' value={egt.diplomaNo} onChange={onChangeHandle} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mezuniyet Tarihi</Form.Label>
                            <FormControl type='date' name='mezuniyet' value={egt.mezuniyet} onChange={onChangeHandle} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => saveOrUpdate()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}