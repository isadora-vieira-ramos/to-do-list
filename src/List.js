import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const List = ({ list, removeItem, editItem, alterCheckbox, clearList, deleteList }) => {
  const{id, items} = list;
  const idList = id;
  return (
    <div className='grocery-list'>
      {items.map((item) => {
        const { id, title, done } = item;
        return (
          <article className='grocery-item' key={id}>
            <div className='newDiv'>
              <input checked={done} className='checkbox' onChange={()=> alterCheckbox(id)} type="checkbox"/>
              <p className='title'>{title}</p>
            </div>
            <div className='btn-container'>
              <button
                type='button'
                className='edit-btn'
                onClick={() => editItem(id)}
              >
                <FaEdit />
              </button>
              <button
                type='button'
                className='delete-btn'
                onClick={() => removeItem(id)}
              >
                <FaTrash />
              </button>
            </div>
          </article>
        );
      })}
      {items.length > 0 &&(
        <button className='clear-btn' onClick={() => clearList(id)}>
            clear items
        </button>
      )}
      <button className='clear-btn' onClick={() => deleteList(idList)}>Delete list</button>
    </div>
  );
};

export default List;
