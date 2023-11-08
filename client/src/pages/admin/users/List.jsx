import { useCallback, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import {BiBlock} from "react-icons/bi"
import {TiTickOutline} from "react-icons/ti"
import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useUsers } from "../../../hooks/useUsers";

export default function List() {
  const { data,  list, deleteById ,blockUser} = useUsers();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    list();
  }, [list]);

 

  const handleBlock = async (event, id,status) => {
    event.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes,${status? "Block" : "Unblock"} it!`,
      });
      if (result.isConfirmed) {
        const resp = await blockUser(id,{isActive : !status} );
        if (resp) {
          Swal.fire({
            title: `${status? "Block" : "Unblock"}!`,
            text: `User has been ${status? "Block" : "Unblock"} !`,
            icon: "success",
          });
         await list();
        }
      }
    } catch (err) {
      alert(err || "Something went wrong");
    }
  };
  const handleDelete = async (event, id,status) => {
    event.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes,${!status? "Archive" : "unArchive"} it!`,
      });
      if (result.isConfirmed) {
        const resp = await deleteById(id, {isArchive : !status});
        if (resp) {
          Swal.fire({
            title: `${!status? "Archive" : "UnArchive"}!`,
            text: `User has been ${!status? "Archive" : "UnArchive"} !`,
            icon: "success",
          });
         await list();
        }
      }
    } catch (err) {
      alert(err || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h1 className="text-center"> Users</h1>
      <div className="d-flex flex-row-reverse">
        <Link className="btn btn-success mb-2" to="/admin/users/add">
          Add New Users
        </Link>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Mail</th>
            <th scope="col">status</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <tr key={item?._id}>
                  <th width="5%">{index + 1}</th>
                  <td>{item?.name}</td>
                  <td>{item?.email}&nbsp; {item?.isEmailVerified ? <TiTickOutline color= "green" /> : null} </td>
                  <td width="10%">
                    <div className="flex d-flex justify-content-evenly">
                      <BsFillTrashFill
                        color="red"
                        onClick={(e) => handleDelete(e, item?._id, item?.isArchive)}
                      />
                      <BsFillPencilFill
                        onClick={() =>
                          navigate(`/admin/users/${item?._id}`)
                        }
                      />
                      <BiBlock onClick={(e)=>handleBlock(e,item?._id, item?.isActive)}/>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>No Data</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
