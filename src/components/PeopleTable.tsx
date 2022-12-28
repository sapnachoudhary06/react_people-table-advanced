import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { Person } from '../types';
import { PersonLink } from './PersonLink';

type Props = {
  people: Person[]
};

enum SortType {
  NAME = 'name',
  SEX = 'sex',
  BORN = 'born',
  DIED = 'died',
  NONE = 'none',
}

enum SortOrder {
  NONE = 'none',
  ASC = 'asc',
  DESC = 'desc',
}

export const PeopleTable: React.FC<Props> = ({ people }) => {
  const findPerson = useCallback((name: string) => {
    return people.find(person => person.name === name);
  }, [people]);

  const persons = useMemo(() => {
    return people.map(person => {
      const father = person.fatherName
        ? findPerson(person.fatherName)
        : undefined;
      const mother = person.motherName
        ? findPerson(person.motherName)
        : undefined;

      return {
        ...person,
        father,
        mother,
      };
    });
  }, [people]);

  const [sortedPeople, setSortedPeople] = useState<Person[]>(persons);
  const [sortType, setSortType] = useState(SortType.NONE);
  const [sortOrder, setSortOrder] = useState(SortOrder.NONE);

  const getNextSortOrder = useCallback((currentSortType: SortType) => {
    if (currentSortType === sortType) {
      if (sortOrder === SortOrder.ASC) {
        return SortOrder.DESC;
      }

      if (sortOrder === SortOrder.DESC) {
        return SortOrder.NONE;
      }

      return SortOrder.ASC;
    }

    return SortOrder.ASC;
  }, [sortOrder, sortType]);

  const sortPeople = useCallback((sort: SortType) => {
    const nextSortOrder = getNextSortOrder(sort);

    setSortOrder(nextSortOrder);
    setSortType(sort);

    setSortedPeople((prevPersons) => {
      switch (sort) {
        case SortType.NAME:
          switch (nextSortOrder) {
            case SortOrder.ASC:
              return [...prevPersons].sort(
                (p1, p2) => (p1.name.localeCompare(p2.name)),
              );
            case SortOrder.DESC:
              return [...prevPersons].sort(
                (p1, p2) => (p2.name.localeCompare(p1.name)),
              );
            default:
              return [...persons];
          }

        case SortType.SEX:
          switch (nextSortOrder) {
            case SortOrder.ASC:
              return [...prevPersons].sort(
                (p1, p2) => (p1.sex.localeCompare(p2.sex)),
              );
            case SortOrder.DESC:
              return [...prevPersons].sort(
                (p1, p2) => (p2.sex.localeCompare(p1.sex)),
              );
            default:
              return persons;
          }

        case SortType.BORN:
          switch (nextSortOrder) {
            case SortOrder.ASC:
              return [...prevPersons].sort((p1, p2) => (p1.born - p2.born));
            case SortOrder.DESC:
              return [...prevPersons].sort((p1, p2) => (p2.born - p1.born));
            default:
              return persons;
          }

        case SortType.DIED:
          switch (nextSortOrder) {
            case SortOrder.ASC:
              return [...prevPersons].sort((p1, p2) => (p1.died - p2.died));
            case SortOrder.DESC:
              return [...prevPersons].sort((p1, p2) => (p2.died - p1.died));
            default:
              return persons;
          }

        default:
          return persons;
      }
    });
  }, [persons, sortOrder, sortType]);

  const getSortOrder = useCallback((sortParam: SortType) => {
    if (sortParam === sortType) {
      return sortOrder;
    }

    return SortOrder.NONE;
  }, [sortType, sortOrder]);

  const selectedPerson = useMatch('/people/:slug')?.params.slug;

  const getPath = useCallback((sort: SortType) => {
    if (sort === sortType) {
      if (SortOrder.ASC === sortOrder) {
        return `?sort=${sortType}`;
      }

      if (SortOrder.DESC === sortOrder) {
        return `?sort=${sortType}&order=${sortOrder}`;
      }
    }

    return '';
  }, [sortType, sortOrder]);

  const getSelectedPersonSlug = useCallback(() => {
    if (selectedPerson) {
      return `/${selectedPerson}`;
    }

    return '';
  }, [selectedPerson]);

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              {SortType.NAME[0].toUpperCase() + SortType.NAME.slice(1)}
              <a
                href={`#/people${getSelectedPersonSlug()}${getPath(SortType.NAME)}`}
                onClick={() => sortPeople(SortType.NAME)}
              >
                <span className="icon">
                  <i className={classNames(
                    'fas',
                    {
                      'fa-sort': getSortOrder(SortType.NAME) === SortOrder.NONE,
                    },
                    {
                      'fa-sort-up': getSortOrder(SortType.NAME)
                         === SortOrder.ASC,
                    },
                    {
                      'fa-sort-down': getSortOrder(SortType.NAME)
                        === SortOrder.DESC,
                    },
                  )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              {SortType.SEX[0].toUpperCase() + SortType.SEX.slice(1)}
              <a
                href={`#/people${getSelectedPersonSlug()}${getPath(SortType.SEX)}`}
                onClick={() => sortPeople(SortType.SEX)}
              >
                <span className="icon">
                  <i className={classNames(
                    'fas',
                    {
                      'fa-sort': getSortOrder(SortType.SEX) === SortOrder.NONE,
                    },
                    {
                      'fa-sort-up': getSortOrder(SortType.SEX)
                        === SortOrder.ASC,
                    },
                    {
                      'fa-sort-down': getSortOrder(SortType.SEX)
                        === SortOrder.DESC,
                    },
                  )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              {SortType.BORN[0].toUpperCase() + SortType.BORN.slice(1)}
              <a
                href={`#/people${getSelectedPersonSlug()}${getPath(SortType.BORN)}`}
                onClick={() => sortPeople(SortType.BORN)}
              >
                <span className="icon">
                  <i className={classNames(
                    'fas',
                    {
                      'fa-sort': getSortOrder(SortType.BORN) === SortOrder.NONE,
                    },
                    {
                      'fa-sort-up': getSortOrder(SortType.BORN)
                        === SortOrder.ASC,
                    },
                    {
                      'fa-sort-down': getSortOrder(SortType.BORN)
                        === SortOrder.DESC,
                    },
                  )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              {SortType.DIED[0].toUpperCase() + SortType.DIED.slice(1)}
              <a
                href={`#/people${getSelectedPersonSlug()}${getPath(SortType.DIED)}`}
                onClick={() => sortPeople(SortType.DIED)}
              >
                <span className="icon">
                  <i className={classNames(
                    'fas',
                    {
                      'fa-sort': getSortOrder(SortType.DIED) === SortOrder.NONE,
                    },
                    {
                      'fa-sort-up': getSortOrder(SortType.DIED)
                        === SortOrder.ASC,
                    },
                    {
                      'fa-sort-down': getSortOrder(SortType.DIED)
                        === SortOrder.DESC,
                    },
                  )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {sortedPeople.map((person) => (
          <tr
            data-cy="person"
            key={person.slug}
            className={classNames({
              'has-background-warning': selectedPerson === person.slug,
            })}
          >
            <td>
              <PersonLink person={person} />
            </td>
            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>

            <td>
              {
                (person.mother
                  ? (
                    <PersonLink
                      person={person.mother}
                    />
                  )
                  : person.motherName || '-'
                )
              }
            </td>

            <td>
              {
                (person.father
                  ? (
                    <PersonLink
                      person={person.father}
                    />
                  )
                  : person.fatherName || '-'
                )
              }
            </td>
          </tr>
        ))}

        {false && (
          <>
            <tr data-cy="person">
              <td>
                <a
                  className="has-text-danger"
                  href="#/people/anna-van-hecke-1607"
                >
                  Anna van Hecke
                </a>
              </td>
              <td>f</td>
              <td>1607</td>
              <td>1670</td>
              <td>Martijntken Beelaert</td>
              <td>Paschasius van Hecke</td>
            </tr>

            <tr data-cy="person">
              <td>
                <a href="#/people/lieven-haverbeke-1631">Lieven Haverbeke</a>
              </td>
              <td>m</td>
              <td>1631</td>
              <td>1676</td>
              <td>
                <a
                  className="has-text-danger"
                  href="#/people/anna-van-hecke-1607"
                >
                  Anna van Hecke
                </a>
              </td>
              <td>
                <a href="#/people/pieter-haverbeke-1602">Pieter Haverbeke</a>
              </td>
            </tr>

            <tr data-cy="person">
              <td>
                <a
                  className="has-text-danger"
                  href="#/people/elisabeth-hercke-1632"
                >
                  Elisabeth Hercke
                </a>
              </td>
              <td>f</td>
              <td>1632</td>
              <td>1674</td>
              <td>Margriet de Brabander</td>
              <td>Willem Hercke</td>
            </tr>

            <tr data-cy="person">
              <td>
                <a href="#/people/daniel-haverbeke-1652">Daniel Haverbeke</a>
              </td>
              <td>m</td>
              <td>1652</td>
              <td>1723</td>
              <td>
                <a
                  className="has-text-danger"
                  href="#/people/elisabeth-hercke-1632"
                >
                  Elisabeth Hercke
                </a>
              </td>
              <td>
                <a href="#/people/lieven-haverbeke-1631">Lieven Haverbeke</a>
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};
