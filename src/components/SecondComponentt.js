import React, { useEffect, useState } from 'react';
import { Form, Image, Col, Row, FormControl, Button, Modal, FormGroup } from 'react-bootstrap';
import { birim_query, gorev_query, kodlar_query, personel_query, save_personel_query, single_personel_query, update_personel_query, upload, upload_query } from '../services/Service';
import { ChildComponent } from './ChildComponent';
import { useQuery, useMutation } from "@apollo/client";

export const SecondComponentt = ({ id, setId, is, setIs, isUpdate, setUpdate }) => {

    const handleClose = () => { setIs(false); setUpdate(false); }

    const save = () => {
        createPersonel({
            variables: {
                ad: personel.ad,
                soyad: personel.soyad,
                foto: personel.foto,
                medeniDurum: personel.medeniDurum,
                kanGrup: personel.kanGrup,
                babaAd: personel.babaAd,
                anaAd: personel.anaAd,
                birimId: personel.birimId,
                gorevId: personel.gorevId
            }
        })
        handleClose();
    }

    const update = () => {
        updatePersonel({
            variables: {
                patch:
                {
                    id: `${personel.id}`,
                    ad: personel.ad,
                    soyad: personel.soyad,
                    foto: personel.foto,
                    medeniDurum: personel.medeniDurum,
                    kanGrup: personel.kanGrup,
                    babaAd: personel.babaAd,
                    anaAd: personel.anaAd,
                    birimId: `${personel.birimId}`,
                    gorevId: `${personel.gorevId}`
                }
            }
        });
        handleClose();
    }

    const [message, setMessage] = useState({
        message: "",
        isStatus: false
    })

    const [isChild, setChild] = useState(false);

    const [personel, setPersonel] = useState({
        id: 0,
        ad: '',
        soyad: '',
        foto: '',
        medeniDurum: '',
        kanGrup: '',
        babaAd: '',
        anaAd: '',
        birimId: '0',
        gorevId: '0'
    });

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setPersonel(
            { ...personel, [name]: value }
        )
    }
    const onChange = (e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        //upload(data).then(data => setPersonel({ ...personel, foto: `/assets/${data}` }))
        //upload({ variables: { input: { file: data } }})
        upload({ variables: { input: data }})
    }

    const { loading: loading1, error: error1, data: personData } = useQuery(single_personel_query, { variables: { id: id } });

    const { loading: loading2, error: error2, data: kodlarMdnData } = useQuery(kodlar_query, { variables: { tablo: 'MDNDRM' } });

    const { loading: loading3, error: error3, data: kodlarKanGrbData } = useQuery(kodlar_query, { variables: { tablo: 'KANGRUP' } });

    const { loading: loading4, error: error4, data: birimlerData } = useQuery(birim_query);

    const { loading: loading5, error: error5, data: gorevlerData } = useQuery(gorev_query);

    const [createPersonel] = useMutation(save_personel_query, { refetchQueries: [personel_query] })

    const [updatePersonel] = useMutation(update_personel_query, { refetchQueries: [personel_query] })

    const [upload, { data: filePath, loading: loading6, error: error6 }] = useMutation(upload_query)

    useEffect(() => {
        if (loading1 === false && personData) {
            setPersonel(personData.singlePersonel);
        }
    }, [personData])

    useEffect(() => {
        if (loading6 === false && filePath) {
            setPersonel({ ...personel, foto: `/assets/${filePath}` })
        }
    }, [filePath])

    if (loading1 || loading2 || loading3 || loading4 || loading5 || loading6) {
        return <div>Loading...</div>
    }


    /*if (error1 || error2 || error3 || error4 || error5 || error6) {
        return <div>Error!</div>;
    }*/


    return (
        <Modal centered={true} size='lg' show={is}>
            <Modal.Header closeButton>
                <Modal.Title>Personel Bilgileri</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex" }}>
                <Col>
                    <Image style={{ width: 150, height: 150 }} src={personel.foto}></Image>
                    {(isUpdate || id === null) && <FormGroup as={Col}>
                        <Form.Control style={{ margin: 20, width: 100 }} type="file" accept='image/*' onChange={onChange} />
                    </FormGroup>}
                </Col>
                <Col style={{ marginRight: 200 }}>
                    <Form>
                        <FormGroup as={Col}>
                            <Row style={{ paddingLeft: 0 }}>
                                <Form.Group as={Col}>
                                    <Form.Label>Ad</Form.Label>
                                    <FormControl type='text' name='ad' value={personel.ad} onChange={onChangeHandle} />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Birim Adı</Form.Label>
                                    <Form.Select name='birimId' value={personel.birimId} onChange={onChangeHandle}>
                                        <option value={''}></option>
                                        {birimlerData.birim.map(birim => (
                                            <option key={birim.id} value={birim.id}>{birim.ad}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Soyad</Form.Label>
                                    <FormControl type='text' name='soyad' value={personel.soyad} onChange={onChangeHandle} />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Görev Adı</Form.Label>
                                    <Form.Select name='gorevId' value={personel.gorevId} onChange={onChangeHandle}>
                                        <option value={''}></option>
                                        {gorevlerData.gorev.map(gorev => (
                                            <option key={gorev.id} value={gorev.id}>{gorev.ad}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Medeni Durumu</Form.Label>
                                    <Form.Select name='medeniDurum' value={personel.medeniDurum} onChange={onChangeHandle}>
                                        <option value={''}></option>
                                        {kodlarMdnData.kodlar.map(tablo => (
                                            <option key={tablo.id} value={tablo.id}>{tablo.kodAck}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <FormGroup as={Col}>
                                    <Row>
                                        <Form.Label>Eğitim Bilgilerine Git</Form.Label>
                                    </Row>
                                    <Row>
                                        <Button onClick={() => setChild(true)} style={{ width: 100, height: 35, marginLeft: 30 }}>Eğitim</Button>
                                    </Row>
                                </FormGroup>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Kan Grubu</Form.Label>
                                    <Form.Select name='kanGrup' value={personel.kanGrup} onChange={onChangeHandle}>
                                        <option value={''}></option>
                                        {kodlarKanGrbData.kodlar.map(tablo => (
                                            <option key={tablo.id} value={tablo.id}>{tablo.kodAck}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Form.Group>
                                <Form.Label>Baba Adı</Form.Label>
                                <FormControl type='text' name='babaAd' value={personel.babaAd} onChange={onChangeHandle} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Ana Adı</Form.Label>
                                <FormControl type='text' name='anaAd' value={personel.anaAd} onChange={onChangeHandle} />
                            </Form.Group>
                        </FormGroup>
                    </Form>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                {<Button variant="secondary" onClick={() => { handleClose(); setId(null) }}>
                    Close
                </Button>}
                {id === null && <Button variant="primary" onClick={save}>
                    Save Changes
                </Button>}
                {isUpdate && <Button className='btn btn-info' onClick={update}>
                    Update
                </Button>}
            </Modal.Footer>
            {isChild ? <ChildComponent id={id} isChild={isChild} setChild={setChild} /> : null}
        </Modal>
    );
}


