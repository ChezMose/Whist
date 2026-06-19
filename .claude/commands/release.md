Release a new version of the Whist APK to GitHub Releases and update the README.

## Steps

1. **Ask the user two questions at once** using AskUserQuestion:
   - "Where is the new APK file?" (file path on disk)
   - "Release type?" with options: "Minor (1.0.7 → 1.0.8)" and "Major (1.0.7 → 1.1.0)"

2. **Read the current version** from `README.md`: find the line containing `releases/download/`, extract the version string like `1.0.0`.

3. **Compute the new version**:
   - Parse X.Y.Z
   - minor → Z+1, keep X.Y  (e.g. 1.0.0 → 1.0.1)
   - major → Y+1, Z=0, keep X  (e.g. 1.0.0 → 1.1.0)
   - New tag: `v<newVersion>`, new filename: `Whist-<newVersion>.apk`

4. **Update the `release/` folder**:
   - Delete the old APK(s) from `release/` (keep `.gitkeep`)
   - Copy the user's file to `release/Whist-<newVersion>.apk`

5. **Create the GitHub release** (do not ask for confirmation — just run it):
   ```
   gh release create v<newVersion> "release/Whist-<newVersion>.apk" --title "v<newVersion>" --notes "Version <newVersion>"
   ```

6. **Update `README.md`**: replace both occurrences of the old version string in the download link line (display text and URL) with the new version. The line looks like:
   ```
   Download the latest [Whist-X.Y.Z.apk](https://github.com/ChezMose/Whist/releases/download/vX.Y.Z/Whist-X.Y.Z.apk)
   ```

7. **Commit and push** `README.md` with message: `Release v<newVersion>`.

8. **Report** the new GitHub release URL to the user.
