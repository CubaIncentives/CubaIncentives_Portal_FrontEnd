# Cuba Agency

## **Prerequisites**

Make sure you have Node.js installed on your machine. You can download it from the official website (https://nodejs.org/).

**Node** version required: `>=18.0.0`

### Steps to Install PNPM:

## PNPM Installation and Package Management on Ubuntu

# Steps for PNPM Installation

1. Update Package List:

```
sudo apt update
```

2. Install Curl:

```
sudo apt install curl -y
```

3. Add Node.js Repository (Skip if Node.js is already installed):

```
sudo apt-get install -y nodejs
```

4. Install PNPM for Node.js (Ubuntu 22.04 or 20.04):

```
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

5. Check PNPM Version:

```
pnpm --version
```

## Package Management with PNPM

1. Install Packages:

```
pnpm add <package-name>
OR
pnpm add <package-name> -w
```

2. Install Packages as Development Dependencies:

```
pnpm add --save-dev <package-name>
```

3. Install Packages Globally:

```
pnpm add -g <package-name>
```

4. Uninstall PNPM Packages:

```
pnpm uninstall <package-name>
```

### Steps to Configure Conventional Commit in Project:

7. Use your Commands to push the code:

```
git add -A

# Use standard following message to commit your code:

1. git commit -m "feat(ANDR-123): implement new feature - (required message)"

OR

2. git commit -m "feat(ANDR-123): implement new feature - (required message)

this is the body of the commit message, providing more details about the change - (optional body message).

footer information can be added here if necessary. - (optional footer message)"

git push origin <branch-name>
```

### react-hot-toast package multiple time toast showing

## Pass successToast('text',id) -> To prevent this pass a one unique ID
