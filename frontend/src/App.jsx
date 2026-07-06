import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import FilterBar from "./components/FIlterBar";

function App() {
  const [task, setTask] = useState({});
  const taskRef = useRef();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [filter, setFilter] = useState({
    statusString: "START",
    sortByTime: true,
    page: 0,
  });
  const fields = [
    {
      label: "Tên công việc",
      type: "name",
      id: "name",
      placeholder: "Tên công việc",
      value: task.name,
      onChange: (event) => {
        setTask({ ...task, name: event.target.value });
      },
    },
    {
      label: "Mô tả",
      type: "text",
      id: "description",
      placeholder: "Mô tả",
      value: task.description,
      onChange: (event) => {
        setTask({ ...task, description: event.target.value });
      },
    },
    {
      label: "Ngày tạo",
      type: "text",
      id: "createdAt",
      placeholder: "Ngày tạo",
      readonly: true,
      value: task.createdAt,
      hide: !task.id,
    },
    {
      label: "Ngày cập nhật",
      type: "text",
      id: "updatedAt",
      placeholder: "Mô tả",
      readonly: true,
      value: task.updatedAt,
      hide: !task.id,
    },
    {
      label: "Trạng thái",
      type: "text",
      id: "status",
      placeholder: "Trạng thái",
      value: task.status,
      readonly: true,
      hide: !task.id,
    },
  ];

  const createTask = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/task`,
        task,
      );
      setTasks([res.data, ...tasks]);
      toast("Tạo thành công");
    } catch (ex) {
      toast.error(ex.message);
    }
    setLoading(false);
  };

  const updateTask = async () => {
    try {
      setLoading(true);
      let body = {};
      if (taskRef.current.name !== task.name) {
        body.name = task.name;
      }
      if (taskRef.current.description !== task.description) {
        body.description = task.description;
      }
      if (!Object.keys(body).length) {
        return;
      }
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/task/${task.id}`,
        body,
      );
      task.name = res.data.name;
      task.description = res.data.description;
      task.updatedAt = res.data.updatedAt;
      toast("Cập nhật thành công");
    } catch (ex) {
      toast.error(ex.message);
    }
    setLoading(false);
  };

  const markTaskComplete = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/task/${task.id}/mark-complete`,
      );
      task.status = res.data.status;
      const newTask = { ...task };
      setTask(newTask);
      taskRef.current = newTask;
      toast("Đã đánh dấu thành công");
    } catch (ex) {
      toast.error(ex.message);
    }
    setLoading(false);
  };

  const markTaskIncomplete = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/task/${task.id}/mark-incomplete`,
      );
      task.status = res.data.status;
      const newTask = { ...task };
      setTask(newTask);
      taskRef.current = newTask;
      toast("Đã đánh dấu thành công");
    } catch (ex) {
      toast.error(ex.message);
    }
    setLoading(false);
  };

  const getTasks = async () => {
    try {
      setTableLoading(true);

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/task`, {
        params: filter,
      });
      setTasks(res.data);
    } catch (ex) {
      toast.error(ex.message);
    }
    setTableLoading(false);
  };

  const search = async () => {
    try {
      setTableLoading(true);
      const filterParam = {
        keyword: filter.keyword,
        statusString: filter.statusString,
        sortByTime: filter.sortByTime,
        page: 0,
      };
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/task`, {
        params: filterParam,
      });
      setFilter(filterParam);
      setTasks(res.data);
    } catch (ex) {
      toast.error(ex.message);
    }
    setTableLoading(false);
  };

  const deleteTask = async (id) => {
    try {
      setTableLoading(true);
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/task/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      if (task.id === id) {
        const newTask = {};
        setTask(newTask);
        taskRef.current = newTask;
      }
      toast("Xoá thành công");
    } catch (ex) {
      toast.error(ex.message);
    }
    setTableLoading(false);
  };

  useEffect(() => {
    getTasks();
  }, [filter.page]);

  return (
    <>
      <div className="position-relative">
        <FilterBar setFilter={setFilter} filter={filter} search={search} />
        <div className="w-100 overflow-auto">
          {tableLoading ? (
            <div className="d-flex justify-content-center align-items-center mb-2">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="table mb-4 table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Tên công việc</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Xem chi tiết</th>
                  <th scope="col">Xoá</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  return (
                    <tr key={task.id}>
                      <th scope="row">{task.id}</th>
                      <td>{task.name}</td>
                      <td>{task.description}</td>
                      <td>{task.createdAt}</td>
                      <td>{task.status}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setTask(task);
                            taskRef.current = task;
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            deleteTask(task.id);
                          }}
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="d-flex gap-2 justify-content-center mb-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (filter.page) {
                  setFilter({ ...filter, page: filter.page - 10 });
                }
              }}
            >
              &larr;
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (tasks.length) {
                  setFilter({ ...filter, page: filter.page + 10 });
                }
              }}
            >
              &rarr;
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <form className="mt-4 d-flex flex-column gap-5 form p-3">
            {fields.map((field, index) => {
              if (field.hide) {
                return null;
              }
              return (
                <div className="form-group" key={index}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    type={field.type}
                    className="form-control mt-2"
                    id={field.id}
                    value={field.value}
                    placeholder={field.placeholder}
                    readOnly={field.readonly}
                    onChange={field.onChange}
                  />
                </div>
              );
            })}
            <div className="d-flex gap-2">
              {task.id ? (
                task.status === "START" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary flex-grow-1"
                      onClick={updateTask}
                    >
                      Cập nhật
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger flex-grow-1"
                      onClick={markTaskIncomplete}
                    >
                      Đánh không hoàn thành
                    </button>
                    <button
                      type="button"
                      className="btn btn-success flex-grow-1"
                      onClick={markTaskComplete}
                    >
                      Đánh hoàn thành
                    </button>
                  </>
                )
              ) : (
                <button
                  type="button"
                  className="btn btn-primary flex-grow-1"
                  onClick={createTask}
                >
                  Tạo
                </button>
              )}
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
