import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { ITableItem, Test, Site } from '../../types';

const Dashboard = () => {

    const navigate = useNavigate();

    const [tests, setTests] = React.useState([]);
    const [sites, setSites] = React.useState([]);
    const [tableItems, setTableItems] = React.useState<ITableItem[]>([])
    const tableColumns = ["Name", "Type", "Status", "Site", ""]
  
    React.useEffect(() => {
    fetchTests();
    fetchSites()
    }, [])
  
    // Creating table after fetch's done
    React.useEffect(() => {
    if (tests.length > 0 && sites.length > 0) { createTableItems() }
    }, [tests, sites])
  
    const createTableItems = () => {
      const testsCopy: Test[] = [...tests];
      const sitesCopy: Site[] = [...sites];
      const itemsToPush: ITableItem[] = []
    
      testsCopy.forEach((item) => {    
      let itemToSet: ITableItem = {
          id: item.id,
          siteId: sitesCopy.find((site) => site.id === item.siteId)?.id!,
          name: item.name,
          type: item.type,
          status: item.status,
          site: sitesCopy.find((site) => site.id === item.siteId)!,
        };
  
      deleteSiteUrl(itemToSet);
  
      itemsToPush.push(itemToSet);
      })
  
      console.log(itemsToPush);
      setTableItems(itemsToPush);
      setFilteredItems(tableItems);
  }

  const deleteSiteUrl = (itemToSet: ITableItem) => {
    let newURL = itemToSet.site?.url;
    if (itemToSet.site?.url.includes("https://")) {
      newURL =  itemToSet.site.url.replace("https://", "");
      } else if (itemToSet.site?.url.includes("http://")) {
      newURL = itemToSet.site.url.replace("http://", "");
      }
      if (itemToSet.site?.url.includes("www.")) {
      newURL = itemToSet.site.url.replace("www.", "");
      }
      return itemToSet.site!.url = newURL!;
  }
    
    // Search
    const [searchValue, setSearchValue] = React.useState("");
    const [filteredItems, setFilteredItems] =  React.useState<ITableItem[]>([])
  
    const handleSearchItem = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchValue(e.target.value); }
  
    React.useEffect(() => {
      searchValue.trim().length > 0
      ? setFilteredItems(tableItems.filter((item) => item.name.includes(searchValue)))
      : setFilteredItems(tableItems);
    }, [searchValue])
  
    // Sorting
    const [selectedColumn, setSelectedColumn] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("asc");
  
    const handleSort = (column: string) => {
      if (column === selectedColumn) {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
      } else {
        setSelectedColumn(column);
        setSortOrder("asc")
      }
    }
  
    React.useEffect(() => {
      const copy = [...tableItems];
  
      switch(selectedColumn) {
        case 'Name': {
        const newItems = copy.sort((a, b) => {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setFilteredItems(newItems);
        break;
        }
  
        case 'Type': {
        const newItems = copy.sort((a, b) => {
          return sortOrder === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
        })
        setFilteredItems(newItems);
        break;
        }
  
        case 'Site': {
        const newItems = copy.sort((a, b) => {
          return sortOrder === "asc" ? a.site.url.localeCompare(b.site.url) : b.site.url.localeCompare(a.site.url);
        })
        setFilteredItems(newItems);
        break;
        }
  
        case 'Status': {
          const statusOrderAsc = {
            ONLINE: 0,
            PAUSED: 1,
            STOPPED: 2,
            DRAFT: 3,
          };
          
          const statusOrderDesc = {
            DRAFT: 0,
            STOPPED: 1,
            PAUSED: 2,
            ONLINE: 3,
          };
          const sortType = sortOrder === "asc" ? statusOrderAsc : statusOrderDesc;
  
          const newItems = copy.sort((a, b) => sortType[a.status] - sortType[b.status]);
          setFilteredItems(newItems);
          break;
        }
  
      }
    }, [selectedColumn, sortOrder])
  
  
    // Functions
    const fetchTests = async () => {
      try {
        const res = await axios.get('http://localhost:3100/tests');
        setTests(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  
    const fetchSites = async () => {
      try {
        const res = await axios.get('http://localhost:3100/sites');
        setSites(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  
    // Render 
    const renderItems = () => {
      return filteredItems.map((item, i) => {
        return (
        <tr className="table-row">
          <td className='table-cell' style={{borderLeft: `4px solid ${getBorderColor(i)}`, borderRadius: "4px", width: 389}}>{item.name}</td>
          <td className='table-cell'>{getType(item.type)}</td>
          <td className='table-cell' style={{color: `${getStatusColor(item.status)}`}}>{item.status.charAt(0).toUpperCase()+ item.status.slice(1).toLowerCase()}</td>
          <td className='table-cell'>{item.site?.url}</td>
          <td className='table-cell' style={{borderRadius: "4px", textAlign: "right"}}>{i % 2 === 0 ? 
          (<button style={{backgroundColor: "#2EE5AC" }} onClick={() => navigate(`/results/${item.id}`)}>Results</button>) 
          : 
          (<button style={{backgroundColor: "#7D7D7D"}} onClick={() => navigate(`/finalize/${item.id}`)}>Finalize</button>)}</td>
        </tr> 
        )
      })
    }
  
    const renderColumns = () => {
      return tableColumns.map((column) => {
        return (
        <>
          <th className='table-header' onClick={() => handleSort(column)}>{column}
          { selectedColumn === column && (
            <svg 
            style={{
              transform: sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease-in-out",
              marginLeft: "8px"
            }}
            width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3.50001L3.13529 0.364716L3.5 7.15256e-06L3.86471 0.364716L7 3.50001L6.63529 3.86472L3.5 0.729424L0.364708 3.86472L0 3.50001Z" fill="#999999"/>
            </svg>  
          )
          }
  
          </th>
          
        </>
        )
      })
    }
  
    // Styles
    const getBorderColor = (index: number) => {
      if (index % 3 === 0) {
        return "#8686FF";
      } else if (index % 2 === 0) {
        return "#C2C2FF"
      } else {
        return "#E14165"
      }
    }
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'ONLINE': {
          return '#1BDA9D'
        }
  
        case 'STOPPED': {
          return "#FE4848"
        }
  
        case 'DRAFT': {
          return "#5C5C5C"
        }
  
        case "PAUSED": {
          return "#FF8346"
        }
      }
    }
  
    const getType = (type: string) => {
      switch (type) {
        case 'CLASSIC': {
          return 'Classic'
        }
        case 'SERVER_SIDE': {
          return 'Server-side'
        }
        case 'MVT': {
          return 'MVT'
        }
      }
    }
  
    return (
      <div className="content__container content">
        <h2 className="content__title">Dashboard</h2>
        <div className="content__search-wrapper">
          <input
          className="search-input" 
          type="text" 
          placeholder='What test are you looking for?' 
          onChange={handleSearchItem} 
          value={searchValue}
          />
          <span style={{fontFamily: "Roboto", color: "#D1D1D1", fontSize: "0.875em"}}>{tests.length} tests</span>
        </div>
        <div>
          {filteredItems.length > 0 ? (
            <table className='content-table'>
            <thead>
              <tr>
                {renderColumns()}
              </tr>
            </thead>
            <tbody>
              {renderItems()}
            </tbody>
          </table>) : 
          (
            <div style={{display: "flex", flexDirection: "column", gap: "37px", alignItems: "center", marginTop: "150px"}}>
              <span>Your search did not match any results.</span>
              <button style={{backgroundColor: "#2EE5AC" }} onClick={() => setSearchValue("")}>Reset</button>
            </div>
          )}
  
        </div>
      </div>
    )
}

export default Dashboard;