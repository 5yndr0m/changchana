# **Dynamic CMS Features**

Add a config file in this directory in order to add content type pages.

After creating a configuration file, route will be auto generated for user to use! 🥰

---

## 🌈 **Example of Singleton**

```javascript
module.exports = {
  singleton: true,
  title: '', // Title displaying on content editing page
  fields: [], // Fields displaying on content editing page
  sidebarFields: [], // Fields displaying on the right on content editing page
}
```
---

## 🌈 **Example of Post Types**
```javascript
module.exports = {
  title: '', // Title displaying on content listing page
  unit: '', // Unit displaying on content listing page
  columns: '', // Columns displaying on content listing page
  fields: [], // Fields on content editing page
  sidebarFields: [], // Fields displaying on the right on content editing page
  initValue: '', // Default value used on post creation
}
```