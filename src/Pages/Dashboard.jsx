import React, { useEffect, useState, useRef } from 'react';

import UpdateProductForm from '../Components/DashboardComponents/UpdateProductForm';

//NEW API IMPORTS - firebaseBranch
import { toast } from 'react-toastify';
import { useGetProductsQuery } from '../Features/firebaseApi';
import Spinner from '../Components/SubComponents/Spinner';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

//Tables
import ProductTableData from '../Components/DashboardComponents/Tables/BigTables/ProductTableData';
import RequestsTableData from '../Components/DashboardComponents/Tables/BigTables/RequestsTableData';
import ProfileColumn from '../Components/DashboardComponents/ProfileColumn';
import MiniTableProduct from '../Components/DashboardComponents/Tables/MiniTables/MiniTableProduct';
import MiniTableRequest from '../Components/DashboardComponents/Tables/MiniTables/MiniTableRequest';

function Dashboard() {
  const userDocId = localStorage.getItem('userDocId');

  const [miniTableStatus, setMiniTableStatus] = useState(true);

  //for dynamic loading for two different tables component need
  //current width and height of window object

  const [currentDimensions, setCurrentDimensions] = useState(
    getCurrentDimensions()
  );

  function getCurrentDimensions() {
    const { innerWidth: width, innerHeight: heigth } = window;
    return {
      width,
      heigth,
    };
  }

  //not good for performance but it solves the problem.
  useEffect(() => {
    function handleResize() {
      setCurrentDimensions(getCurrentDimensions());
    }
    console.log('Current Size: ', currentDimensions);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentDimensions]);

  //Local STATES
  const [formState, setFormState] = useState({
    productTitle: '',

    productStock: 0,
    productOgPrice: 0,
    productSaleRate: 0,
  });

  //DECLARATIONS
  const modalRef = useRef();

  //firebaseBranch
  const {
    isError,
    isLoading,
    isFetching,
    isSuccess,
    data: dataArray,
    error,
  } = useGetProductsQuery({ type: 'userProducts', label: userDocId } || '');

  useState(() => {
    isError && toast.error(error);
  }, [isError, userDocId, dataArray, isFetching, isSuccess]);

  return (
    <div className='dashboard'>
      <div className='myContainer'>
        <ProfileColumn dataArray={dataArray} />

        <div className='dashboard-panel'>
          <div className='dashboard-table'>
            <div className='miniTableTitles'>
              <button onClick={() => setMiniTableStatus(true)}>
                MY PRODUCTS
              </button>
              <button onClick={() => setMiniTableStatus(false)}>
                MY REQUESTS
              </button>
            </div>
            <h3>My Products</h3>
            {currentDimensions.width > 1200 ? (
              <div className='tableDiv'>
                <table className='table'>
                  <thead className='table-head'>
                    <tr>
                      <td scope='col'>PRODUCT NAME</td>

                      <td scope='col'>STOCK</td>
                      <td scope='col'>ORIGINAL PRICE</td>
                      <td scope='col'>SALE RATE</td>
                      <td scope='col'>PRICE</td>

                      <td scope='col'></td>
                    </tr>
                  </thead>

                  <tbody className='table-rows'>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      dataArray?.map((product) => {
                        return (
                          <ProductTableData
                            key={product.id}
                            data={{
                              id: product.id,
                              title: product.title,

                              stock: product.stock,
                              price: product.price,
                              saleRate: product.saleRate,
                            }}
                            modalRef={modalRef}
                            setFormState={setFormState}
                          />
                        );
                      })
                    )}
                  </tbody>
                </table>
                <div className='createProductDiv'>
                  <Link to='/productAdd'>
                    <MDBBtn color='mdb-color' className='text-xs-left'>
                      Create a new Product
                    </MDBBtn>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {miniTableStatus ? (
                  <div className='miniTable'>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      dataArray.map((product) => {
                        return (
                          <MiniTableProduct
                            key={product.id}
                            data={{
                              id: product.id,
                              title: product.title,

                              stock: product.stock,
                              price: product.price,
                              saleRate: product.saleRate,
                            }}
                            modalRef={modalRef}
                            setFormState={setFormState}
                          />
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className='miniTable'>
                    <MiniTableRequest />
                  </div>
                )}
              </>
            )}
          </div>
          {currentDimensions.width > 1200 && (
            <div className='dashboard-table'>
              <h3>Product Requests</h3>
              <div className='tableDiv'>
                <table className='table'>
                  <thead className='table-head'>
                    <tr>
                      <td scope='col'>PRODUCT NAME</td>
                      <td scope='col'>QUANTITY</td>
                      <td scope='col'>CUSTOMER EMAIL</td>
                      <td scope='col'>DATE</td>
                      <td scope='col'>PRICE</td>
                      <td scope='col'>STATUS</td>
                    </tr>
                  </thead>

                  <tbody className='table-rows'>
                    <RequestsTableData />
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div ref={modalRef} className='bg-productForm '>
        <UpdateProductForm formState={formState} modalRef={modalRef} />
      </div>
    </div>
  );
}

export default Dashboard;
