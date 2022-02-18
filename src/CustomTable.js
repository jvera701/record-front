import 'antd/dist/antd.css';
import { Table, Button, notification,  Form, Input, Typography, Popconfirm, InputNumber  } from 'antd';
import customAxios from './axios'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function CustomTable() {
  const [form] = Form.useForm();
  const [data, setData] = useState([])
  const [index, setIndex] = useState(-1)
  const [editingKey, setEditingKey] = useState('');
  let navigate = useNavigate();
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      tipo_doc: '',
      doc: '',
      nombres: '',
      apellidos: '',
      hobbie: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const columns = [
    {
      title: 'Tipo de documento',
      dataIndex: 'tipo_doc',
      editable: true,
    },
    {
      title: 'Documento',
      dataIndex: 'doc',
      editable: true,
    },
    {
      title: 'Nombres',
      dataIndex: 'nombres',
      editable: true,
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      editable: true,
    },
    {
      title: 'Hobbie',
      dataIndex: 'hobbie',
      editable: true,
    },
    {
      title: 'Editar',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    }
  ];

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const newItem = { ...item, ...row }
        handle_edit(newItem)
        newData.splice(index, 1, newItem);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };
  

  async function fetchData(){
    try{
      const res = await customAxios.get(customAxios.defaults.baseURL)
      const arr_data = res.data.documents
      const ans = arr_data.map((obj, i) => ({...obj, "key": i }))
      setData(ans)
    }
    catch (error) {
      console.error(error);
    }
  }
  async function handle_delete(){
    if (index !== -1){
      try{
        await customAxios.delete(customAxios.defaults.baseURL,
        {
          data: {
            '_id' : data[index]._id
          }
        })
        notification.open({
          message: 'Documento exitosamente eliminado',
          type: 'success'
        });
        const new_data = data.filter( e => e.key !== index )
        setData(new_data)
        setIndex(-1)
      }
      catch (e){
        notification.open({
          message: 'Algo estuvo mal, intenta de nuevo',
          type: 'error'
        });
        console.error(e)
      }
    }
  }

  async function handle_edit(row){
    try{
      const res = await customAxios.patch(customAxios.defaults.baseURL,
        {
          data: {
            'tipo_doc' : row.tipo_doc,
            'doc' : row.doc,
            'nombres' : row.nombres,
            'apellidos' : row.apellidos,
            'hobbie' : row.hobbie,
            '_id': row._id
          }
        })
      if (res.status == 200){
        notification.open({
          message: 'Editado exitosamente',
          type: 'success'
        });
      }
      else{
        notification.open({
          message: 'Algo estuvo mal, intenta de nuevo',
          type: 'error'
        });
      }
    }
    catch (error) {
      notification.open({
        message: 'Algo estuvo mal, intenta de nuevo',
        type: 'error'
      });
      console.error(error);
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setIndex(selectedRowKeys[0])
    },
    getCheckboxProps: (record) => (
    {
      // Column configuration not to be checked
      nombres: record.nombres
    })
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect( () => { fetchData() }, [])
  return <>
          <Form form={form} component={false}>
          <Table columns={columns} dataSource={data} pagination={false}  rowClassName="editable-row" columns={mergedColumns}
            rowSelection={{
              type: 'radio',
              ...rowSelection
            }}        
            components={{
              body: {
                cell: EditableCell,
              },
            }}/>
          </Form>
          <Button type="primary" onClick={() => handle_delete()}>Eliminar</Button>
          <Button type='primary' onClick={() => navigate('/create')}>Agregar</Button>
        </> ;
}

export default CustomTable;
