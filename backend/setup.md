# 🚀 Project Setup Guide – Flood Rescue Coordination

This guide explains how to configure and run the **Flood-Rescue-Coordination backend** using IntelliJ IDEA.

---

# 1. Open the Project
Open the project folder **Flood-Rescue-Coordination** using **IntelliJ IDEA**.

File → Open → Select Flood-Rescue-Coordination folder

---

# 2. Open the Run Configuration Menu
1. Click the **Menu icon (☰)** located in the **top-left corner** of IntelliJ IDEA.
2. Select **Run**.
3. Select Edit Configurations...

---

# 3. Access Run Configurations
From the **Run menu**, select:

This will open the configuration window.

---

# 4. Create a New Application Configuration
1. Click the **➕ (Add New Configuration)** button in the top-left corner.
2. Choose the configuration type:

---

# 5. Configure Application Settings

Fill in the following fields:

### Build and Run

| Field | Value |
|-----|-----|
| **SDK** | `21` |
| **Module (-cp)** | `backend` |
| **Main class** | `com.rescue.backend.FloodRescueCoordinationApplication` |

To find the **Main class**, click the **class selector icon** and navigate to:

---

# 6. Enable Additional Options

Click the blue link:

Modify options

---

Enable the following:

- ✅ **Working directory**
- ✅ **Environment variables**

---

# 7. Configure Environment Settings

### Working Directory

Set the working directory to the **backend folder** (where the `pom.xml` file is located).

Example:

D:\FPT_University\prj301\Flood-Rescue-Coordination

### Environment Variables

1. Click the **file icon** at the end of the field.
2. Select the `.env` file located inside the **backend folder**.

Example path:

D:/FPT_University/prj301/Flood-Rescue-Coordination/.env

---

# 8. Apply and Run the Application

1. Click **Apply** to save the configuration.
2. Click **Run ▶** (green triangle icon) to start the backend server.

---
# 9. Setup MySQL Database

To run the backend successfully, you must install **MySQL Server** and initialize the database used by the Flood Rescue Coordination system.

---

## Step 9.1: Download MySQL Installer

Download the **MySQL Installer** from the provided **Google Drive link**.

[Download MySQL Installer](https://drive.google.com/drive/u/0/folders/1-o-26cV1B0YvS_QCc-L3dLvUD78nGFRn)

Or watch database setup on **[youtube link](https://www.youtube.com/watch?v=F5mDv9Tjztg)**.

After downloading, run the installer to begin the setup process.

---

## Step 9.2: Choose Setup Type

During installation, when the **Choosing a Setup Type** window appears:

Select:

**Full**

This option installs:

- MySQL Server
- MySQL Workbench
- Required connectors and development tools

Then click **Next**.

---

## Step 9.3: Install MySQL

Continue the installation process by clicking:

Next → Next → Next

Wait until the installation completes.

---

## Step 9.4: Product Configuration

In the **Product Configuration** step:

Only configure the following component:

**MySQL Server 8.0.44**

Continue clicking **Next** until reaching the account configuration step.

---

## Step 9.5: Configure Account & Role

In the **Accounts and Roles** section, set the MySQL root account as follows:

| Field | Value |
|------|------|
| Username | `root` |
| Password | `12345` |

These credentials will be used by the backend application to connect to the database.

Click **Next**.

---

## Step 9.6: Apply Configuration

At the **Apply Configuration** step:

Click:

**Execute**

Wait until all configuration steps display **Complete**, then click **Finish**.

---

## Step 9.7: Open MySQL Workbench

Launch **MySQL Workbench**.

Connect using the following credentials:

| Field | Value |
|------|------|
| Username | `root` |
| Password | `12345` |

---

## Step 9.8: Run Database Script

1. Open the file: schema.sql

inside the project folder.

2. Copy the SQL script.

3. Paste it into the **MySQL Workbench SQL Editor**.

4. Click the **⚡ Lightning icon (Execute)** to run the script.

This script will create the required database schema for the system.
 