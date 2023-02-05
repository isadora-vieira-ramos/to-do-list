import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';
import Sidebar from './Sidebar';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaEdit} from 'react-icons/fa';
import { useGlobalContext } from './context';
import { RiAddCircleLine } from "react-icons/ri";

const getLocalStorageLists = () => {
  let lists = localStorage.getItem('lists');
  if (lists) {
    return (lists = JSON.parse(localStorage.getItem('lists')));
  } else {
    return [];
  }
}

function App() {
  const { openSidebar, listIndex, setListIndex } = useGlobalContext();
  const [lists, setLists] = useState(getLocalStorageLists());
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [isEditingListName, setisEditingListName] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isEditingListName){
      if (!name) {
        showAlert(true, 'danger', 'please enter value');
      }else if (name && isEditing) {
        const itemIndex = lists[listIndex].items.findIndex((item) => item.id === editID);
        const newLists = [...lists];
        newLists[listIndex].items[itemIndex] = {
          ...newLists[listIndex].items[itemIndex],
          title: name
        }
        setLists(newLists);
        setName('');
        setEditID(null);
        setIsEditing(false);
        showAlert(true, 'success', 'value changed');
      } else {
        showAlert(true, 'success', 'item added to the list');
        const newItem = {id: Date.now().toString(), title: name, done: false}
        const currentList = [...lists];
        currentList[listIndex].items = [
          ...currentList[listIndex].items,
          newItem
        ];
        setLists(currentList);
        setName('');
      }
    }else {
      if (!name) {
        showAlert(true, 'danger', 'please enter value');
      }else {
        setLists(
          lists.map((list) => {
            if (list.id === editID) {
              return { ...list, name: name };
            }
            return list;
          })
        );
        setName('');
        setisEditingListName(false);
        showAlert(true, 'success', 'value changed');
      }
    }
  };

  const addList = () => {
    var lastElementId = 0;
    if(lists.length > 0){
      const lastElement = lists[lists.length -1];
      const {id} = lastElement;
      lastElementId = id;
    }

    const newList = {
      id: lastElementId + 1,
      name: `New List ${lists.length + 1}`,
      items : []
    }
    setLists([...lists, newList]);
    setListIndex(lists.length);
    setName('');
    setEditID(null);
    setIsEditing(false);
    showAlert(true, 'success', 'New notes list');
  }

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const clearList = (id) => {
    showAlert(true, 'danger', 'empty list');
    const newList = lists.map((list) => {
      if(list.id === id){
        return { ...list, items: [] }
      }else{
        return list;
      }
    });
    setLists(newList);
  };

  const deleteList = (id) =>{
    showAlert(true, 'danger', 'List removed');
    setListIndex(0);
    setLists(lists.filter((list) => list.id !== id));
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setLists(lists.map((list) => {
      return { ...list, items: list.items.filter((item) => item.id !== id) }
    }))
  };

  const alterCheckbox = (id) => {
    const itemIndex = lists[listIndex].items.findIndex((item) => item.id === id);
    const newLists = [...lists];
    newLists[listIndex].items[itemIndex] = {
      ...newLists[listIndex].items[itemIndex],
      done: !newLists[listIndex].items[itemIndex].done
    }
    showAlert(true, 'success', 'Checked value changed');
  }

  const editName = () => {
    setisEditingListName(true);
    const id = lists[listIndex].id;
    setEditID(id);
    setName(lists[listIndex].name);
  }

  const editItem = (id) => {
    const specificItem = lists[listIndex].items.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  if (lists.length < 1) {
    return (
      <section className='section-center'>
        <div className='grocery-form'>
          <h3>No notes saved</h3>
          <button className='add-btn' onClick={() => addList()}>Add one here</button>
        </div>
      </section>
    )
  }

  return (
    <>
      <button onClick={openSidebar} className='sidebar-toggle'>
        <AiOutlineMenu />
      </button>
      <Sidebar lists={lists}></Sidebar>
      <section className='section-center'>
        <RiAddCircleLine className='addNotesButton' onClick={() => addList()}></RiAddCircleLine>
        <form className='grocery-form' onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} lists={lists} />}

          <div className='form-control'>
            <h3 className={`${isEditingListName && 'listName'}`}>
              {`${listIndex!==null ? lists[listIndex].name : 'To Do List'}`}</h3>
            <button type='button' className={`${isEditingListName? 'listName' : 'edit-name-btn'}`}>
              <FaEdit onClick={() => editName()} />
            </button>
          </div>
          <div className='form-control'>
            <input
              type='text'
              className='grocery'
              placeholder='e.g. buy pasta'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type='submit' className='submit-btn'>
              {isEditing ? 'edit' : 'submit'}
            </button>
          </div>
        </form>
        {lists.length > 0 && (
          <div className='grocery-container'>
            <List list={lists[listIndex]} deleteList = {deleteList} clearList={clearList} removeItem={removeItem} editItem={editItem} alterCheckbox={alterCheckbox} />
          </div>
        )}
      </section>
    </>
  );
}

export default App;
