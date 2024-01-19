import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const MasterData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://prod-20.centralindia.logic.azure.com:443/workflows/8dc83d094a1f4e94a3abaa30e8e6bbad/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nKZxchuRl6rRCySUk643tS2NIqLT1IbIOxPJit-U8ls',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Add any required payload or body here
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Error fetching data');
      }
    };

    fetchData();
  }, []);

  console.log('Data:', data); // Log the entire data structure

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : data ? (
        <Table border={1} className="table table-hover table-containers">
          <Thead>
            <Tr>
              <Th>Annuities of Instruction Project :</Th>
              <Th className="annuities-id">Annuities Id :</Th>
            </Tr>
          </Thead>
          <Tbody style={{ border: "1px solid lightgray" }}>
            {data.map((item, index) => (
              <Tr key={index}>
                <Td>{item.InstructionType}</Td>
                <Td>{item.AnnuitiesID}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MasterData;
