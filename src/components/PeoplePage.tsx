import { useCallback, useEffect, useState } from 'react';
import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';
import { Person } from '../types';
import { getPeople } from '../api';

export const PeoplePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [isError, setIsError] = useState(false);

  const fetchPeople = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const fetchedpeople = await getPeople();

      setPeople(fetchedpeople);
    } catch (error) {
      // do somthing
      setIsError(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            {people.length > 1 && (
              <PeopleFilters />
            )}
          </div>

          <div className="column">
            <div className="box table-container">
              {isLoading && (
                <Loader />
              )}

              {isError && (
                <p data-cy="peopleLoadingError">Something went wrong</p>
              )}

              {people.length === 0 && !isLoading && false && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              {false && (
                <p>There are no people matching the current search criteria</p>
              )}

              {people.length > 1 && (
                <PeopleTable people={people} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
