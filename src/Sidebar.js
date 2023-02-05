import React from 'react';
import { useGlobalContext } from './context';
import {AiOutlineMenu} from 'react-icons/ai';
const Sidebar = ({lists}) => {
    const { isSidebarOpen, closeSidebar, setListIndex } = useGlobalContext();

    const setIndex = (id) =>{
      const index = lists.findIndex((item) => item.id === id);
      setListIndex(index);
      closeSidebar();
    }

    return (
      <aside className={`${isSidebarOpen ? 'sidebar show-sidebar' : 'sidebar'}`}>
        <div className='sidebar-header'>
          <button className='sidebar-toggle' onClick={closeSidebar}>
            <AiOutlineMenu />
          </button>
        </div>
        <ul className='notes'>
          {lists.map((item) => {
            const { id, name } = item;
            return (
              <button key={id} onClick={()=> setIndex(id)}>
                {name}
              </button>
            );
          })}
        </ul>
      </aside>
    );
}

export default Sidebar;