import { React, useState, useEffect } from "react";
import axios from "axios";
import styles from "./Paintings.module.scss";
import { Select, Input, Range, Pagination } from "fwt-internship-uikit";

const API_URL = "https://test-front.framework.team";
const AUTHORS_URL = `${API_URL}/authors`;
const LOCATIONS_URL = `${API_URL}/locations`;
const PAINTINGS_URL = `${API_URL}/paintings`;

const Paintings = ({ isDarkTheme }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //Данные с API
  const [paintings, setPaintings] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .all([axios.get(AUTHORS_URL), axios.get(LOCATIONS_URL)])
      .then((res) => {
        setAuthors(res[0].data);
        setLocations(res[1].data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  //Состояния фильтров для запроса
  //Храню всё в одном состоянии (так можно быстро и просто обнулять всё через setFilters({}))
  const [filters, setFilters] = useState({
    authorsName: undefined,
    nameValue: undefined,
    locationsName: undefined,
    valueFrom: undefined,
    valueBefore: undefined,
    currentPage: undefined, //По умолчанию 1
  });

  useEffect(() => {
    const getAuthorByName = (authorName) => {
      return authors.find((author) => author.name === authorName);
    };

    const getLocationByName = (locationName) => {
      return locations.find((name) => name.location === locationName);
    };

    //Собираю параметры запроса
    const queryParams = [
      filters.authorsName &&
        `authorId=${getAuthorByName(filters.authorsName)?.id}`,
      filters.nameValue && `q=${filters.nameValue}`,
      filters.locationsName &&
        `locationId=${getLocationByName(filters.locationsName)?.id}`,
      filters.valueBefore && `created_lte=${filters.valueBefore}`,
      filters.valueFrom && `created_gte=${filters.valueFrom}`,
      `_page=${filters.currentPage}`,
      "_limit=12",
    ]
      .filter((param) => Boolean(param))
      .join("&");

    axios.get(`${PAINTINGS_URL}?${queryParams}`).then((res) => {
      setPaintings(res.data);
    });
  }, [
    authors,
    locations,
    filters.authorsName,
    filters.nameValue,
    filters.locationsName,
    filters.valueFrom,
    filters.valueBefore,
    filters.currentPage,
  ]);

  // ищу объекты с определенным условием authors & locations
  const getAuthorById = (authorId) => {
    return authors.find((author) => author.id === authorId);
  };

  const getLocationById = (locationId) => {
    return locations.find((location) => location.id === locationId);
  };

  // добавление класса для кнопки сброса фильтра
  const addOpenClass = (propName, propString) => {
    return propName !== propString ? "btn__isOpen" : "";
  };

  // Вывод картин ===
  const paintingRes = paintings.map((painting) => (
    <article className={styles.descriptionImg} key={painting.id}>
      <img src={`${API_URL}${painting.imageUrl}`} alt={painting.name} />
      <div className={styles.caption}>
        <p>
          <strong>{painting.name}</strong>
        </p>
        <p>
          <b>Author: </b>
          <span>{getAuthorById(painting.authorId)?.name}</span>
        </p>
        <p>
          <b>Created: </b>
          <span>{painting.created}</span>
        </p>
        <p>
          <b>Location: </b>
          <span>{getLocationById(painting.locationId)?.location} </span>
        </p>
      </div>
    </article>
  ));

  if (error) {
    return <h2 className={styles.error}>Error: {error}</h2>;
  }

  return (
    <>
      <div className={styles.filter}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.filter__form}
        >
          <Input
            value={filters.nameValue || ""}
            onFocus={() => setFilters({})}
            onChange={(e) => setFilters({ nameValue: e.target.value })}
            placeholder="Name"
            isDarkTheme={isDarkTheme}
          />

          <div className="select__container">
            <Select
              options={authors}
              onChange={(e) =>
                setFilters(() => ({
                  authorsName: e,
                }))
              }
              value={filters.authorsName || "Author"}
              isDarkTheme={isDarkTheme}
            />
            <p
              onClick={() => setFilters({})}
              className={`${"remove__btn"} ${
                isDarkTheme && "btn__dark"
              } ${addOpenClass(filters.authorsName, undefined)}`}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.36474 1.21893C2.07355 0.924339 1.60144 0.924339 1.31025 1.21893C1.01906 1.51351 1.01906 1.99113 1.31025 2.28572L3.25004 4.24815C3.63511 4.63771 3.63511 5.26457 3.25004 5.65413L1.21644 7.71146C0.92525 8.00604 0.92525 8.48366 1.21644 8.77825C1.50763 9.07284 1.97974 9.07284 2.27093 8.77825L4.28821 6.73743C4.67966 6.34142 5.31917 6.34142 5.71061 6.73743L7.72779 8.77815C8.01898 9.07274 8.49109 9.07274 8.78228 8.77815C9.07347 8.48356 9.07347 8.00594 8.78228 7.71136L6.74879 5.65413C6.36371 5.26457 6.36372 4.63771 6.74879 4.24814L8.68848 2.28582C8.97966 1.99124 8.97967 1.51361 8.68848 1.21903C8.39729 0.92444 7.92517 0.924441 7.63399 1.21903L5.71061 3.16485C5.31917 3.56086 4.67966 3.56086 4.28821 3.16485L2.36474 1.21893Z" />
              </svg>
            </p>
          </div>

          <div className="select__container">
            <Select
              options={locations.map((item) => ({
                ...item,
                name: item.location,
              }))}
              onChange={(e) =>
                setFilters(() => ({
                  locationsName: e,
                }))
              }
              value={filters.locationsName || "Location"}
              isDarkTheme={isDarkTheme}
            />
            <p
              onClick={() => setFilters({})}
              className={`${"remove__btn"} ${
                isDarkTheme && "btn__dark"
              } ${addOpenClass(filters.locationsName, undefined)}`}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.36474 1.21893C2.07355 0.924339 1.60144 0.924339 1.31025 1.21893C1.01906 1.51351 1.01906 1.99113 1.31025 2.28572L3.25004 4.24815C3.63511 4.63771 3.63511 5.26457 3.25004 5.65413L1.21644 7.71146C0.92525 8.00604 0.92525 8.48366 1.21644 8.77825C1.50763 9.07284 1.97974 9.07284 2.27093 8.77825L4.28821 6.73743C4.67966 6.34142 5.31917 6.34142 5.71061 6.73743L7.72779 8.77815C8.01898 9.07274 8.49109 9.07274 8.78228 8.77815C9.07347 8.48356 9.07347 8.00594 8.78228 7.71136L6.74879 5.65413C6.36371 5.26457 6.36372 4.63771 6.74879 4.24814L8.68848 2.28582C8.97966 1.99124 8.97967 1.51361 8.68848 1.21903C8.39729 0.92444 7.92517 0.924441 7.63399 1.21903L5.71061 3.16485C5.31917 3.56086 4.67966 3.56086 4.28821 3.16485L2.36474 1.21893Z" />
              </svg>
            </p>
          </div>

          <Range isDarkTheme={isDarkTheme} onClose={() => {}}>
            <input
              onChange={(e) =>
                setFilters((old) => ({
                  valueFrom: e.target.value,
                  valueBefore: old.valueBefore,
                }))
              }
              value={filters.valueFrom || ""}
              placeholder="from"
              className={`${"range__input"}${
                isDarkTheme ? " range__input--dark" : ""
              }`}
            />
            <div
              className={`${"div__border"}${
                isDarkTheme ? " div__border--dark" : ""
              }`}
            ></div>
            <input
              onChange={(e) =>
                setFilters((old) => ({
                  valueBefore: e.target.value,
                  valueFrom: old.valueFrom,
                }))
              }
              value={filters.valueBefore || ""}
              placeholder="before"
              className={`${"range__input"}${
                isDarkTheme ? " range__input--dark" : ""
              }`}
            />
          </Range>
        </form>
      </div>

      <div className={styles.paintings}>
        {isLoading ? <h2>Loading...</h2> : paintingRes}
      </div>
      <div className={styles.pagination}>
        <Pagination
          isDarkTheme={isDarkTheme}
          pagesAmount={5}
          currentPage={filters.currentPage || 1}
          onChange={(e) => setFilters((old) => ({ ...old, currentPage: e }))}
        />
      </div>
    </>
  );
};

export default Paintings;
