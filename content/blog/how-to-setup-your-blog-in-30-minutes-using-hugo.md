+++
banner = ""
date = 2020-07-02T12:00:00Z
description = "Step-by-step tutorial on how to set up a Hugo blog in 30 minutes, from installation to theme setup and publishing your first technical article."
tags = ["Hugo", "Web Development"]
title = "How to setup your blog in 30 minutes using Hugo"

+++
**Hugo can be used for free to create, transform, and manage your blog in a short time.**

_![A Laptop and a notepad](https://i.pinimg.com/originals/9a/09/ad/9a09adc43eb27ee0e66b396017582cfe.jpg "Writing")_

_Photo by Nick Morrison on Unsplash_

***

[Hugo](https://gohugo.io/) is an open-source static site generator (or a framework) that makes it easy for you to dynamically create, transform, and manage your blog. It can also be integrated into CMSs (Content Management Systems) like Forestry or Netlify CMS. Imagine you're building a house. First, you have to build the foundation. That's the framework (Hugo). Then you build the house on the framework: you add walls, windows, doors, etc (your blog). 

[My blog](https://blog.toluwalemi.com/) was built with Hugo and organisations like [Forestry](https://forestry.io/) and [Let's Encrypt](https://letsencrypt.org/) both use Hugo. This post explains how to install Hugo on your PC. Once installed, you'll be able to use Hugo as a tool for creating, transforming, and managing your blog.

### Intro

You'll be installing Hugo on a terminal running Windows 7, Windows 8, or Windows 10. After that, you'll choose a theme for your blog, customise the theme, and publish your first blog post. (For installation on Mac OS, kindly visit [Hugo's website](https://gohugo.io/getting-started/installing/#macos) to get started.)

### Prerequisites

This post assumes that you know how to use tools like Git and command-line tools like Window's CMD.

#### Install Hugo

Head over to your Local Disk (C:) and create a folder named `Hugo`. Inside your newly created Hugo folder, create another folder named `bin`. The location should be similar to this:

    C:\Hugo\bin

Next, visit [https://github.com/gohugoio/hugo/releases](https://github.com/gohugoio/hugo/releases "https://github.com/gohugoio/hugo/releases") to download the latest version of Hugo. Scroll down to the bottom of the page and download the Windows version (32-bit or 64-bit). (Mac users should download the Mac OS version.)

![https://i.pinimg.com/originals/43/28/8b/43288b67ec9cdad5814da0a9a8ddc0ab.png](https://i.pinimg.com/originals/43/28/8b/43288b67ec9cdad5814da0a9a8ddc0ab.png)

Extract the contents of the zipped folder into the bin folder you created earlier. Your bin folder should now contain `hugo.exe` and these files: `LICENSE`, `README.md`.

Before you check if you installed Hugo properly, add`C:\Hugo\bin` to `Path` under User variables in your Environment Variables. That is, search for environment variables in your control panel. Click on Environment Variables. Under User variables, edit `Path`and append to `C:\Hugo\bin` to it.

Check if you have installed Hugo properly:

    C:\Users\user>hugo version

    Hugo Static Site Generator v0.72.0-8A7EF3CF windows/386 BuildDate: 2020-05-31T12:09:10Z

#### Install Hugo Theme

Hugo has hundreds of stunning themes you can choose from and if you are not careful, you may find your self spending hours on their [themes page](https://themes.gohugo.io/) drooling over them.

You'll be making use of a very simple Hugo theme named 'hello-friend'. (Visit [https://themes.gohugo.io/theme/hugo-theme-hello-friend/](https://themes.gohugo.io/theme/hugo-theme-hello-friend/ "https://themes.gohugo.io/theme/hugo-theme-hello-friend/") for a demo.) I love this theme because of its simplicity and aesthetics, hence, I opted to make use of it while designing my blog.

Create a new folder in your Hugo folder. Let's call it `myblog.`Inside this newly created folder, open your terminal, initialise git, and add the theme as a git submodule.

    C:\Hugo\myblog>git init

    C:\Hugo\myblog>git submodule add https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend

#### Run Your Blog

Create a new file named `config.toml` in the root of your blog folder (i.e. `C:\Hugo\myblog`) and copy the following contents into it:

    baseurl = "/"
    languageCode = "en-us"
    theme = "hello-friend"
    paginate = 5
    
    [params]
      # dir name of your blog content (default is `content/posts`).
      # the list of set content will show up on your index page (baseurl).
      contentTypeName = "posts"
    
      # "light" or "dark"
      defaultTheme = "dark"
    
      # if you set this to 0, only submenu trigger will be visible
      showMenuItems = 2
    
      # Show reading time in minutes for posts
      showReadingTime = false
    
      # Show table of contents at the top of your posts (defaults to false)
      # Alternatively, add this param to post front matter for specific posts
      # toc = true
    
      # Show full page content in RSS feed items
      #(default is Description or Summary metadata in the front matter)
      # rssFullText = true
    
    [languages]
      [languages.en]
        title = "Hello Friend"
        subtitle = "A simple theme for Hugo"
        keywords = ""
        copyright = ""
        menuMore = "Show more"
        writtenBy = "Written by"
        readMore = "Read more"
        readOtherPosts = "Read other posts"
        newerPosts = "Newer posts"
        olderPosts = "Older posts"
        minuteReadingTime = "min read"
        dateFormatSingle = "2006-01-02"
        dateFormatList = "2006-01-02"
        # leave empty to disable, enter display text to enable
        # lastModDisplay = ""
    
        [languages.en.params.logo]
          logoText = "hello friend"
          logoHomeLink = "/"
        # or
        #
        # path = "/img/your-example-logo.svg"
        # alt = "Your example logo alt text"
    
        [languages.en.menu]
          [[languages.en.menu.main]]
            identifier = "about"
            name = "About"
            url = "/about"
          [[languages.en.menu.main]]
            identifier = "showcase"
            name = "Showcase"
            url = "/showcase"

From your blog's root (`C:\Hugo\myblog`) directory, run:

    hugo server -t hello-friend

Your blog is now running.

    hugo server -t hello-friend
    Building sites …
                       | EN
    -------------------+-----
      Pages            |  7
      Paginator pages  |  0
      Non-page files   |  0
      Static files     | 16
      Processed images |  0
      Aliases          |  1
      Sitemaps         |  1
      Cleaned          |  0
      ​
      Built in 2613 ms
      Watching for changes in C:\Hugo\testing\themes\hello-friend\{layouts,static}
      Environment: "development"
      Serving pages from memory
      Running in Fast Render Mode. For full rebuilds on change: hugo server --disableF                                                                                                                astRender
      Web Server is available at //localhost:1313/ (bind address 127.0.0.1)
      Press Ctrl+C to stop

In your web browser, visit [`localhost:1313/`](http://localhost:1313/). You should see something similar to this:

![https://i.pinimg.com/originals/57/a6/5f/57a65f41981828ff25af412fd8baf896.png](https://i.pinimg.com/originals/57/a6/5f/57a65f41981828ff25af412fd8baf896.png)

On the navbar, you can toggle the icon just beside 'Showcase' to switch between a dark theme and a light theme. Isn't that cool?

#### Customise Your Theme

Edit the `config.toml` file:

* Change `contentTypeName` from `"posts"` to `"blog".`
* Set showReadingTime to `true`.
* Under `[languages]` change `title` to `"YourName"`(e.g.`"Toluwalemi"`). Change `subtitle` to "`BLOG"`.
* Under `[languages.en.params.logo]`change `logoText` to `"YourName"`.

Head over to your web browser and reload the page, you should see some changes.

#### Publish a Post

Inside your blog's main directory (`C:\Hugo\myblog`), create a new folder named `Content`. Inside this new folder, create another folder named `blog`. This folder will contain markdown files of your blog posts.

Locate `C:\Hugo\myblog\themes\hello-friend\exampleSite\content\post` and copy `hello.md` into `C:\Hugo\testing\Content\blog`. Restart your server (`hugo server -t hello-friend`) and visit `localhost:1313/`.

Congratulations! You have just published your first blog post.

If you want to tweak your blog further, kindly visit the [official documentation](https://themes.gohugo.io/hugo-theme-hello-friend/) for more options.

How can you start publishing articles to your audience with a domain name? In my next blog post, I will be showing you an easy way on how you can deploy your website to Netlify and how to use a CMS tool like Forestry to publish your articles.

***

Feel free to reach out with questions, comments, or just to talk. [**Say ‘hello’ to me :)**](https://twitter.com/toluwalemi)
