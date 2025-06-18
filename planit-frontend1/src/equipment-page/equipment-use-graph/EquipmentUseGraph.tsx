import './EquipmentUseGraph.css';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { FETCH_STATUS } from '../../fetchStatus';
import Loading from '../../loading/loading';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface GraphData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

interface receivedData{
  nom: string;
  details: string;
  sub_category_name: string;
  use_number: number;
}

function EquipmentUseGraph(props:any){
    const { data, status } = props;

    const [labels ,setLabels] = useState<string[]>([]);
    const [cleanData ,setCleanData] = useState<any[]>([]);


    const emptyGraphData: GraphData = {
        labels: labels, 
        datasets: [
          {
            label: 'Disponibilité',
            data: cleanData, 
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      };

    const [graphdata, setGraphData] = useState<GraphData>(emptyGraphData);

    useEffect(() => {
        if (status === FETCH_STATUS.SUCCESS && data) {
            cleanGraphData();
            setGraphData({
                labels: labels,
                datasets: [
                    {
                        label: 'Nombre d\'utilisations',
                        data: cleanData,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [data, status]);

    const cleanGraphData = () => {
      const top5 = [...data].sort((a, b) => b.use_number - a.use_number).slice(0, 5);
      top5.forEach((item: receivedData) => {
        setLabels((prevLabels)=>([...prevLabels, item.nom]));
        setCleanData((prevData)=>([...prevData, item.use_number]));
      });
    }
    
    if (status === FETCH_STATUS.LOADING) {
        return (
            <div className='quipment_disponibility_graph_containing_div'>
                <Loading />
            </div>
        );
    }

    if (status === FETCH_STATUS.ERROR) {
        return (
            <div className='quipment_disponibility_graph_containing_div'>
                <p>Error loading data</p>
            </div>
        );
    }
    
    return(
        <div className='quipment_disponibility_graph_containing_div'>
            <Bar data={graphdata} />
        </div>
    );
}

export default EquipmentUseGraph;
