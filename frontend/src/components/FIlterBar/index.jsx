import { useState } from "react";
import "./index.css";

const FilterBar = ({ filter, setFilter, search }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="overflow-auto d-none d-md-block">
        <div className="filter d-flex gap-2 w-100 align-items-center p-2">
          <div className="form-group flex-grow-1 ">
            <input
              type="text"
              className="form-control h60"
              id="keyword"
              value={filter.keyword}
              placeholder={"Từ khoá"}
              onChange={(e) => {
                setFilter({ ...filter, keyword: e.target.value });
              }}
            />
          </div>
          <div className="form-group flex-grow-1">
            <select
              className="form-select form-select-lg h60"
              aria-label=".form-select-lg example"
              onChange={(event) => {
                setFilter({ ...filter, statusString: event.target.value });
              }}
            >
              <option value="START">START</option>
              <option value="COMPLETE">COMPLETE</option>
              <option value="INCOMPLETE">INCOMPLETE</option>
            </select>
          </div>

          <button
            className={`btn ${filter.sortByTime ? "btn-primary" : "btn-success"}`}
            onClick={() => {
              setFilter({ ...filter, sortByTime: !filter.sortByTime });
            }}
          >
            Sắp xếp theo thời gian ({filter.sortByTime ? "mới dần" : "cũ dần"})
          </button>
          <button className="btn btn-primary" onClick={search}>
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="p-2 d-md-none d-flex justify-content-end">
        <button
          className="menuButton"
          onClick={() => {
            setShow(true);
          }}
        >
          <div className="line" />
          <div className="line" />
          <div className="line" />
        </button>
      </div>

      {show && (
        <div className="position-absolute mobileFilterBackground">
          <div className="mobileFilter bg-white align-items-end flex-column d-flex gap-2 w-100 p-2">
            <div className="justify-content-end">
              <button
                className="menuButton"
                onClick={() => {
                  setShow(false);
                }}
              >
                <div className="line" />
                <div className="line" />
                <div className="line" />
              </button>
            </div>
            <div className="form-group w-100">
              <input
                type="text"
                className="form-control h60"
                id="keyword"
                value={filter.keyword}
                placeholder={"Từ khoá"}
                onChange={(e) => {
                  setFilter({ ...filter, keyword: e.target.value });
                }}
              />
            </div>
            <div className="form-group w-100">
              <select
                className="form-select form-select-lg h60"
                aria-label=".form-select-lg example"
                value={filter.statusString}
                onChange={(event) => {
                  setFilter({ ...filter, statusString: event.target.value });
                }}
              >
                <option value="START">START</option>
                <option value="COMPLETE">COMPLETE</option>
                <option value="INCOMPLETE">INCOMPLETE</option>
              </select>
            </div>
            <button
              className={`btn ${filter.sortByTime ? "btn-primary" : "btn-success"} w-100`}
              onClick={() => {
                setFilter({ ...filter, sortByTime: !filter.sortByTime });
              }}
            >
              Sắp xếp theo thời gian ({filter.sortByTime ? "mới dần" : "cũ dần"}
              )
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShow(false);
                search();
              }}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;
