import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import customAxios from './axios'
function Create(){
    let navigate = useNavigate();
    const [tipoDoc, setTipoDoc] = useState('')
    const [doc, setDoc] = useState('')
    const [nombres, setNombres] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [hobbie, setHobbie] = useState('')

    function updateTipoDoc(e) {
        e.preventDefault()
        setTipoDoc(e.target.value)
    }

    function updateDoc(e) {
        e.preventDefault()
        setDoc(e.target.value)
    }

    function updateNombre(e) {
        e.preventDefault()
        setNombres(e.target.value)
    }

    function updateApellidos(e) {
        e.preventDefault()
        setApellidos(e.target.value)
    }

    function updateHobbie(e) {
        e.preventDefault()
        setHobbie(e.target.value)
    }
    
    async function submit(){
        try{
            await customAxios.post(customAxios.defaults.baseURL,
                {
                  data: {
                    'tipo_doc' : tipoDoc,
                    'doc' : doc,
                    'nombres' : nombres,
                    'apellidos' : apellidos,
                    'hobbie' : hobbie
                  }
                })
            navigate('/')
        }
        catch(e){

        }
    }
    return <>
        <Form>
            <Form.Item name="tipo_doc" label="Tipo de documento">
                <Input onChange={updateTipoDoc}/>
            </Form.Item>
            <Form.Item name="doc" label="Documento">
                <Input onChange={updateDoc} />
            </Form.Item>
            <Form.Item name="nombres" label="Nombres">
                <Input onChange={updateNombre}/>
            </Form.Item>
            <Form.Item name="apellidos" label="Apellidos">
                <Input onChange={updateApellidos} />
            </Form.Item>
            <Form.Item name="hobbie" label="Hobbie">
                <Input onChange={updateHobbie}/>
            </Form.Item>
        </Form>
        <Button type='primary' onClick={() => navigate('/')}>Volver</Button>
        <Button type='primary' onClick={() => submit()}>Crear</Button>
    </>
}

export default Create