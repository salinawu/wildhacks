# -*- coding: utf-8 -*-
"""
Created on Sat Nov 21 20:10:08 2015

@author: kzen 
"""

# -*- coding: utf-8 -*-
import pandas as pd
import imp
import sqlite3
import mysql.connector
from sqlalchemy import create_engine


PATH_ROOT = "/home/kzen/repos/wildhacks/"
FILE_PATH_FAST = PATH_ROOT+ "data/fastfoodmaps_locations_2007.csv"
FILE_PATH_INSP = PATH_ROOT+ "data/Food_Inspections.csv"

DB_FILE = PATH_ROOT+ "db.sqlite3"

cluster_list = []
#CONFIGS_PATH = PATH_ROOT + "scripts/configs.py"
#configs = imp.load_source("configs", CONFIGS_PATH)


def get_lat_fast(df):
    return float(df.split()[0].strip("(,)"))
def get_long_fast(df):
    return float(df.split()[1].strip("(,)"))

def get_lat_chain(df):
    last_coord = len(df.split())-2
    return float(df.split()[last_coord:][0].strip("(,)"))
    
def get_long_chain(df):
    last_coord = len(df.split())-2

    return float(df.split()[last_coord:][1].strip("(,)"))


def add_name(df,name):
    type_list = [name for row in range(0,len(df.index))]
    df["STORE_TYPE"] = pd.Series(type_list,index = df.index)
    return df[["STORE_TYPE","LATITUDE","LONGITUDE"]]

def cluster_helper(row):
    row.LATITUDE < cluster_list[0]+0.1 and row.LATITUDE > cluster_list[0] - 0.1
    if row.LATITUDE < cluster_list[0]+0.1 and row.LATITUDE > cluster_list[0] - 0.1:
        return True
    elif row.LONGITUDE < cluster_list[1]+0.1 and row.LONGITUDE > cluster_list[1] - 0.1:
        return True
    return False
#    start = 0
#    curr = row.LATITUDE
#    for a in str(row.LATITUDE):
#        if a == ".":
#            start +=1
#            break
#        start +=1
#    decimal = len(str(row.LATITUDE)) - start
#    for i in range(1,5):
#        bound = i/decimal
#        if curr+bound in cluster_list or curr-bound in cluster_list:
#            return True
#        cluster_list.append(curr+bound)
#        cluster_list.append(curr-bound)
#    return False
    
def cluster(df):
    for index, row in df.iterrows():
        cluster_list.append(row.LATITUDE)
        clust_list.append(row.LONGITUDE)
    df["remove"] = df.apply(func = cluster_helper, axis = 1)
    df = df[df["remove"] == True]
    df = df[["LATITUDE", "LONGITUDE"]]
    return df
    
if __name__ == "__main__":
        
    # INDEPENDENT STORES
    df_fast = pd.read_csv(FILE_PATH_FAST, header = None)
    df_fast = df_fast[[7,8]]
    df_fast = df_fast.rename(columns = {7:"LATITUDE",8:"LONGITUDE"})
        
    df_insp = pd.read_csv(FILE_PATH_INSP)
    df_insp = df_insp[df_insp['Facility Type'] == "Restaurant"]
    df_insp = df_insp[['Latitude','Longitude']]
    df_insp = df_insp[pd.notnull(df_insp['Latitude'])] # assume that nan for long has lat nan
    df_insp = df_insp.rename(columns = {"Latitude":"LATITUDE","Longitude":"LONGITUDE"})


    col = ["LATITUDE","LONGITUDE"]
    df_final = pd.DataFrame(columns = col)
    df_final = df_final.append(df_fast)
    df_final = df_final.append(df_insp)
    df_final = df_final.reset_index(drop = True)
    df_final = df_final.drop_duplicates()
    df_final = df_final.drop_duplicates(subset = "LATITUDE")
    df_final = df_final.drop_duplicates(subset = "LONGITUDE")


    engine = create_engine('sqlite:///'+ DB_FILE)
    c = engine.connect()
    
    conn = c.connection
    df_final.to_sql("restaurants", con = conn)

#    df_final = cluster(df_final)

