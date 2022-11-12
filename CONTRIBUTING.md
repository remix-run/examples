# Contributing

Thanks for your willingness to contribute an example to Remix. Examples are incredibly helpful to people like you who are trying to figure out how to use Remix to solve certain problems and integrate with other tools.

## Keep your example focused

What makes a good example is focus. There's certainly room for examples that show off a whole app experience and we do have some examples like that. But the vast majority of useful examples are focused on a specific use-case. Otherwise it's hard for people to know what to look for in the code.

This means you should avoid adding stuff that isn't absolutely necessary for the example. Start with bare bones and add only what you need.

Most examples should:

- Not use a database
- Have no more than one or two routes (some may not even need any routes)
- Have only necessary deps
- Not use complex validation
- Be as practical as reasonable (balanced with the focus). Just, no `foo`/`bar` please.

## How to contribute a new example

1. Fork this repository (click the [Fork](https://github.com/remix-run/examples/fork) button at the top of this page)

2. Clone your fork locally

   ```sh
   # in a terminal, cd to parent directory where you want your clone to be, then
   git clone https://github.com/<your_github_username>/examples.git
   cd examples
   ```

3. Create a new branch for your example

   ```sh
   # Use the new folder you're adding as the branch name
   # Example: git checkout -b vanilla-extract
   git checkout -b <folder-name>
   ```

4. Add your example

   To create an example, simply copy/paste the [`__template`](__template) directory into the folder name you've chosen in the previous step.

   Make the changes you need for your example, update the `README.md`, make sure that it works and that you kept it focused (see above).

5. Commit your changes and push it to your new branch

   ```sh
   git add <folder-name>
   git commit -m "feat: add `<FOLDER-NAME>` example"
   git push -u origin <folder-name>
   ```

6. Head to the [examples repository](https://github.com/remix-run/examples), GitHub will prompt you to create a pull request against the repository.

7. You're done, thank you! 🎉
