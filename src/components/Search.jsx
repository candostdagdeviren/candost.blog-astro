import {createSignal} from "solid-js";
import _ from 'lodash'
import {formatDate} from "../utils/formatDate.ts";
import {t} from '../i18n/utils.ts'

export function Search(props) {
  const [inputVal, setInputVal] = createSignal('')
  const [resultPosts, setResultPosts] = createSignal([])

  const handleChange = (e) => {
    const value = e.target.value
    setInputVal(value)
    if (value === '') {
      setResultPosts([])
    } else {
      const filterBlogs = props.posts.filter(post =>
        post.data.title.toLowerCase().includes(value.toLowerCase()) ||
        post.data.description?.toLowerCase().includes(value.toLowerCase())
      )
      const reg = new RegExp(value, 'gi')
      const cloneBlogs = filterBlogs.map(blog => ({
        ...blog,
        data: {
          ...blog.data,
          title: blog.data.title.replace(reg, match => `<span class="text-skin-active font-bold">${match}</span>`),
          description: blog.data.description?.replace(reg, match => `<span class="text-skin-active font-bold">${match}</span>`) || ''
        }
      }))
      setResultPosts(cloneBlogs)
    }
  }

  return (
    <div>
      <label class="relative block">
        <span class="absolute inset-y-0 flex items-center pl-2 opacity-75">
          <i class="ri-search-line text-skin-active ml-1"></i>
        </span>
        <input
          id="search-input"
          class="block w-full rounded border border-opacity-40 bg-skin-fill text-skin-base py-3 pl-10 pr-3 placeholder:italic placeholder:text-opacity-75 focus:border-skin-accent focus:outline-none"
          placeholder={t('search.placeholder')}
          type="text"
          name="search"
          value={inputVal()}
          onInput={handleChange}
          autofocus
        />
      </label>

      {resultPosts().length > 0 && (
        <div class="my-2">
          {t('search.searchLabelOne')}
          <span class="px-2 font-bold text-skin-active">{resultPosts().length}</span>
          {t('search.searchLabelTwo')}
        </div>
      )}

      <div class="my-4">
        {resultPosts().map(post => (
          <>
            <a
              class="text-xl underline-offset-4 decoration-skin-base decoration-wavy hover:underline hover:decoration-sky-500 font-bold"
              href={`/${post.collection === 'posts' ? post.slug : `${post.collection}/${post.slug}`}`}
              innerHTML={post.data.title}
            />
            <div class="flex items-center">
              {post.data.date && (
                <div class="flex items-center cursor-pointer">
                  <i class="ri-calendar-2-fill mr-1"/>
                  <div class="tag">{formatDate(post.data.date)}</div>
                </div>
              )}
            </div>
            <p class="break-all mb-4" innerHTML={post.data.description}></p>
          </>
        ))}
      </div>
    </div>
  )
}
