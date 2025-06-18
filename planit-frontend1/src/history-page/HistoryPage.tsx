// HistoryPage.tsx
import { useState, useEffect } from 'react';
import './HistoryPage.css';
import { FETCH_STATUS } from '../fetchStatus';
import Sidebar from '../sidebar/Sidebar';
import { Search } from 'lucide-react';
import HistoryEvent from './history-element/HistoryEvent'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';
import { ServerIpAddress } from '../URLS';

interface HistoryItem {
  ID: string;
  num_tel: number;
  client_nom: string;
  event_nom: string;
  date: string;
  type: string;
  email: string;
}


interface SelectedItems {
  [key: string]: boolean;
}

function HistoryPage() {
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${ServerIpAddress}/getEventsHistory`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      setHistory(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error while getting events History');

    }
  };

  // For filtering the history data
  const filteredHistory = history.filter(item => {
    return (
      item.client_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.event_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.num_tel)?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: isSelected
    }));
  };


  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const newSelectedItems: SelectedItems = {};
    
    filteredHistory.forEach(item => {
      newSelectedItems[item.ID] = isSelected;
    });
    
    setSelectedItems(newSelectedItems);
  };

  const isAllSelected = filteredHistory.length > 0 && 
    filteredHistory.every(item => selectedItems[item.ID]);

  return (
    <div className='history_page'>
      <Sidebar />
      <div className='history_page_container'>
        <div className='history_page_header'>
          <h1 className='history_page_title'>history</h1>
          <div className='history_page_search'>
            <input
              type="text"
              placeholder="Search"
              className='history_page_search_input'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='history_page_search_icon' size={20} />
          </div>
        </div>

        <div className='history_page_table_container'>
          <table className='history_page_table'>
            <thead>
              <tr>
                <th className='history_page_checkbox_header'>
                  {/*<input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />*/}
                </th>
                <th className='history_page_phone_header'>
                  phone number 
                </th>
                <th className='history_page_name_header'>
                  Name 
                </th>
                <th className='history_page_event_header'>
                  event 
                </th>
                <th className='history_page_date_header'>
                  Date 
                </th>
                <th className='history_page_status_header'>
                  Type 
                </th>
                <th className='history_page_email_header'>email</th>
                <th className='history_page_actions_header'></th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={8} className="history_page_loading">Loading data...</td>
                </tr>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <HistoryEvent key={item.ID} item={item} isSelected={selectedItems[item.ID]} onSelect={handleSelectItem}/>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="history_page_no_data">No history data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}



export default HistoryPage;