import { component$, Resource } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler} from '@builder.io/qwik-city';
import { useEndpoint } from '@builder.io/qwik-city';
import TheShowImage from '~/components/TheShowImage';
import { MetaName } from '~/types';

export interface ICategories {
  id: number;
  image: string;
  name: string;
  creationAt: string;
  updatedAt: string;
}

export const onGet: RequestHandler<ICategories[]> = () => {
  const host = import.meta.env.VITE_STORY_HOST;
  const categories = fetch(host + '/categories?limit=10').then(data => data.json()).catch(err => err);
  return categories;
};

export default component$(() => {
  const categories = useEndpoint<ICategories[]>();

  return (
    <div >
      <Resource
        value={categories}
        onResolved={_categories => {
          return <div class="gap-2 grid grid-cols-3">
            {_categories.map((category) => <a href={'/category/' + category.id} key={category.id + ':' + category.name} >
              <TheShowImage image={category.image} title={category.name} />
            </a>)}
          </div>;
        }}
      />
    </div>
  );
});

export const head: DocumentHead<ICategories[]> = ({ data }) => {
  if (!data?.length) return {};
  const cs = data.map(({ name }) => name).join(', ');
  return {
    meta: [
      { name: MetaName.ogTitle, property: MetaName.ogTitle, content: 'CATEGORIES' },
      { name: MetaName.ogDesc, property: MetaName.ogDesc, content: 'CATEGORIES: ' + cs },
      { name: MetaName.ogImage, property: MetaName.ogImage, content: data?.[0]?.image },
      { name: MetaName.desc, property: MetaName.desc, content: 'CATEGORIES: ' + cs },
      { name: MetaName.keys, property: MetaName.keys, content: cs },
    ]
  };
};